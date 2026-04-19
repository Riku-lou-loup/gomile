<?php
/**
 * @file
 * @brief Endpoints REST exposes pour les webhooks Gomile.
 * @package GomileShipment
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * @brief Expose les points d'entree REST utilises par l'API Gomile.
 *
 * @package GomileShipment
 */
class Gomile_Shipment_REST_Endpoints {
    /**
     * @brief Branche l'enregistrement des routes REST.
     *
     * @return void
     */
    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_routes'));
    }

    /**
     * @brief Enregistre la route de webhook.
     *
     * @return void
     */
    public static function register_routes() {
        register_rest_route(
            'gomile-shipment/v1',
            '/webhook',
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'permission_callback' => '__return_true',
                'callback'            => array(__CLASS__, 'handle_webhook'),
            )
        );
    }

    public static function handle_webhook($request) {
    }

    protected static function resolve_order_from_payload($payload) {
    }

    protected static function extract_payload_value($payload, $keys) {
    }
}
