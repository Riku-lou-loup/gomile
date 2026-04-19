<?php
/**
 * @file
 * @brief Hooks WooCommerce lies a la commande et a la creation de livraison.
 * @package GomileShipment
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('woocommerce_checkout_order_processed', 'gomile_shipment_handle_order', 10, 1);
add_action('woocommerce_store_api_checkout_order_processed', 'gomile_shipment_handle_block_order', 10, 1);
add_action('woocommerce_order_status_processing', 'gomile_shipment_maybe_dispatch_after_payment', 10, 1);
add_action('woocommerce_order_status_completed', 'gomile_shipment_maybe_dispatch_after_payment', 10, 1);

/**
 * @brief Point d'entree checkout classique.
 *
 * @param $order_id Identifiant de commande WooCommerce.
 * @return void
 */
function gomile_shipment_handle_order($order_id) {
    $order = wc_get_order($order_id);
    if ($order) {
        gomile_shipment_process_order($order, 'checkout');
    }
}

/**
 * @brief Point d'entree checkout blocs / Store API.
 *
 * @param $order Commande WooCommerce deja instanciee.
 * @return void
 */
function gomile_shipment_handle_block_order($order) {
    if ($order instanceof WC_Order) {
        gomile_shipment_process_order($order, 'store_api_checkout');
    }
}

/**
 * @brief Retente la creation de livraison quand la commande passe a un etat paye.
 *
 * @param $order_id Identifiant de commande WooCommerce.
 * @return void
 */
function gomile_shipment_maybe_dispatch_after_payment($order_id) {
    $order = wc_get_order($order_id);

    if ($order) {
        gomile_shipment_process_order($order, 'order_status');
    }
}

/**
 * @brief Initialise les metadonnees Gomile sur la commande et declenche la creation
 * de livraison si l'option automatique est active.
 *
 * @param $order Commande WooCommerce.
 * @param $trigger Origine de l'appel.
 * @return void
 */
function gomile_shipment_process_order($order, $trigger = 'manual') {
    if (!$order instanceof WC_Order || !gomile_shipment_order_uses_method($order)) {
        return;
    }

    if (!$order->get_meta('_gomile_shipment_status')) {
        $order->update_meta_data('_gomile_shipment_status', 'pending');
    }

    if (!$order->get_meta('_gomile_shipment_delivery_id')) {
        $order->update_meta_data('_gomile_shipment_delivery_id', '');
    }

    $order->save();

    if (!Gomile_Shipment_Admin_Settings::is_auto_create_enabled()) {
        return;
    }

    gomile_shipment_dispatch_delivery($order, $trigger);
}

/**
 * @brief Cree effectivement la livraison cote API si elle n'existe pas deja.
 *
 * @param $order Commande WooCommerce.
 * @param $trigger Origine de l'appel.
 * @return void
 */
function gomile_shipment_dispatch_delivery($order, $trigger = 'manual') {
    if (!$order instanceof WC_Order) {
        return;
    }

    $already_created = 'yes' === (string) $order->get_meta('_gomile_shipment_delivery_created', true);
    $existing_delivery_id = (string) $order->get_meta('_gomile_shipment_delivery_id', true);

    if ($already_created || '' !== $existing_delivery_id) {
        return;
    }

    $status = (string) $order->get_meta('_gomile_shipment_status', true);

    if ('creating' === $status) {
        return;
    }

    $api = Gomile_Shipment_Delivery_API::instance();

    if (!$api->is_configured()) {
        $order->update_meta_data('_gomile_shipment_status', 'configuration_missing');
        $order->update_meta_data('_gomile_shipment_delivery_created', 'no');
        $order->save();
        $order->add_order_note(__('Gomile delivery was not created because the API is not configured yet.', 'gomile-shipment'));
        return;
    }

    $order->update_meta_data('_gomile_shipment_status', 'creating');
    $order->delete_meta_data('_gomile_shipment_last_error');
    $order->save();

    $response = $api->create_delivery($order);

    if (is_wp_error($response)) {
        $order->update_meta_data('_gomile_shipment_status', 'api_error');
        $order->update_meta_data('_gomile_shipment_delivery_created', 'no');
        $order->update_meta_data('_gomile_shipment_last_error', $response->get_error_message());
        $order->save();

        $order->add_order_note(
            sprintf(
                __('Gomile delivery creation failed during %1$s: %2$s', 'gomile-shipment'),
                $trigger,
                $response->get_error_message()
            )
        );

        return;
    }

    $delivery_id = isset($response['delivery_id']) ? (string) $response['delivery_id'] : '';
    $delivery_status = isset($response['status']) ? sanitize_key($response['status']) : 'created';
    $tracking_url = isset($response['tracking_url']) ? esc_url_raw($response['tracking_url']) : '';

    if ('' !== $delivery_id) {
        $order->update_meta_data('_gomile_shipment_delivery_id', $delivery_id);
    }

    if ('' !== $tracking_url) {
        $order->update_meta_data('_gomile_shipment_tracking_url', $tracking_url);
    }

    $order->update_meta_data('_gomile_shipment_delivery_created', 'yes');
    $order->update_meta_data('_gomile_shipment_status', $delivery_status ? $delivery_status : 'created');
    $order->save();

    $note = sprintf(
        __('Gomile delivery created during %1$s. Delivery ID: %2$s. Status: %3$s', 'gomile-shipment'),
        $trigger,
        $delivery_id ? $delivery_id : __('not returned by API', 'gomile-shipment'),
        $delivery_status ? $delivery_status : __('created', 'gomile-shipment')
    );

    if ('' !== $tracking_url) {
        $note .= ' ' . sprintf(__('Tracking URL: %s', 'gomile-shipment'), $tracking_url);
    }

    $order->add_order_note($note);
}

/**
 * @brief Verifie si la commande utilise la methode d'expedition Gomile.
 *
 * @param $order Commande WooCommerce.
 * @return bool
 */
function gomile_shipment_order_uses_method($order) {
    if (!$order instanceof WC_Order) {
        return false;
    }

    foreach ($order->get_shipping_methods() as $shipping_item) {
        if ('gomile_shipment' === $shipping_item->get_method_id()) {
            return true;
        }
    }

    return false;
}
