import {Spinner} from '@shopify/polaris';
import {SpinnerProps} from '@shopify/polaris/dist/types/latest/src/components/Spinner/Spinner';
import React from 'react';
import './Loader.scss';

interface Props {
    defaultHeight?: number | string;
    size?: SpinnerProps['size'];
}

const Loader = ({defaultHeight = 400, size = 'large'}: Props) => (
    <div className="loader" style={{height: defaultHeight}}>
        <Spinner size={size} />
    </div>
);

export default Loader;
