import React from 'react';

import GojekSvg from '@/images/gojek.svg';

interface Props {
    name: string;
    size?: string;
    backgroundColor?: string;
}

// NOTE: Slug img comes from /public/index.html external stylesheet link

export default function SlugIcon({name, size = '48px', backgroundColor = '#dfe3e8'}: Props) {
    return (
        <div
            style={{
                width: size,
                height: size,
                backgroundColor,
            }}
        >
            <img
                src={
                    name === 'gojek'
                        ? GojekSvg
                        : `https://assets.aftership.com/couriers/svg/${name}.svg`
                }
                alt=""
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}
