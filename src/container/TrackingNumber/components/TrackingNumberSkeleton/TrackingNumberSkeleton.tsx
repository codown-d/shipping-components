import {
    SkeletonPage,
    Layout,
    Card,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
} from '@shopify/polaris';
import React from 'react';

const TrackingNumberSkeleton = () => {
    return (
        <SkeletonPage primaryAction>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );
};

export default TrackingNumberSkeleton;
