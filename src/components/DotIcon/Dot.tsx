import React from 'react';

import styles from './Dot.module.scss';

const DotIcon = () => {
    return (
        <span className={styles.dot}>
            <span className="Polaris-Navigation__Indicator">
                <span className="Polaris-Indicator Polaris-Indicator--pulseIndicator" />
            </span>
        </span>
    );
};

export default DotIcon;
