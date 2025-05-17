import React, {ReactNode, SVGProps} from 'react';

import PartnerItem from './PartnerItem';

export interface IPartnerConfig {
    slug: string;
    title: ReactNode;
    subtitle?: ReactNode;
    hidden?: boolean;
}

export interface IPrimaryAction {
    content?: string;
    showAction?: boolean;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.FC<SVGProps<SVGSVGElement>>;
    onAction?: (config: IPartnerConfig) => void;
    render?: (option: Omit<IPartnerOption, 'component'>) => ReactNode;
}

export type IPartnerOption = {
    primaryAction?: IPrimaryAction;
    component?: ReactNode;
} & IPartnerConfig;

const Partners = ({options}: {options: IPartnerOption[]}) => {
    return (
        <>
            {options
                ?.filter(option => !option?.hidden)
                ?.map(option => <PartnerItem key={option.slug} option={option} />)}
        </>
    );
};

Partners.Item = PartnerItem;

export default Partners;
