import React from 'react';
import clsx from 'clsx';

interface Props {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    theme?: 'black' | 'white' | 'grey' | 'primary' | 'secondary' | 'tertiary';
    component?: React.ElementType;
    children: React.ReactNode;
}

export const Typography = ({
    variant = 'p',
    weight = 'normal',
    theme = 'black',
    component: Component = "div",
    children,
}: Props) => {
    let variantStyles: string;

    switch (variant) {
        case 'h1':

    }
    return <Component className={clsx(variantStyles)}>{children}</Component>;
}