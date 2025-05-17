import {Link, Stack} from '@shopify/polaris';
import {Trans} from 'react-i18next';

import {NAMESPACE} from '@/i18n';

interface IProps {
    onLoading: (loading: boolean) => void;
    registerUrl: string;
}

const CanadaPostLinks = ({onLoading, registerUrl}: IProps) => {
    return (
        <Stack vertical>
            <p>
                <Trans ns={NAMESPACE} i18nKey="canada_post.do_not_have_account">
                    Don't have a Canada Post account?{' '}
                    <Link removeUnderline url="https://www.canadapost.ca/" external>
                        <span>Register now</span>
                    </Link>
                </Trans>
            </p>
            <p>
                <Trans ns={NAMESPACE} i18nKey="canada_post.have_account">
                    Already have a Canada Post account?{' '}
                    <Link
                        removeUnderline
                        onClick={() => {
                            onLoading(true);
                            location.href = registerUrl;
                        }}
                    >
                        <span>Login with Canada Post</span>
                    </Link>
                </Trans>
            </p>
        </Stack>
    );
};

export default CanadaPostLinks;
