import {Modal, Stack, Card} from '@shopify/polaris';
import React, {useState} from 'react';

import Loader from '@/components/Loader';

interface Props {
    loading: boolean;
    title: string;
}

export default function LoadingModal({loading, title}: Props) {
    const [isLoading, updateLoading] = useState(loading);
    return (
        <Modal open={isLoading} onClose={() => updateLoading(false)} title={title}>
            <Card sectioned>
                <Stack vertical alignment="center">
                    <Loader />
                </Stack>
            </Card>
        </Modal>
    );
}
