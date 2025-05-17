import React, { useCallback, useRef, useState } from 'react';
import { Button, Heading, Modal, TextContainer } from '@shopify/polaris';

import EasyshipLogo from '@/assets/easyship/easyship-logo.svg';
import styles from './StartService.module.scss'
import Divider from '../Divider';
interface Props {
	title: String
}
export default function StartService(props: Props) {
	let { title } = props
	const [active, setActive] = useState(true);
	const handleChange = useCallback(() => setActive(!active), [active]);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const handleClose = useCallback(() => setActive(false), []);
	return (<>
		<Button onClick={handleChange}>{title || '打开弹框'}</Button>
		<Modal
			activator={buttonRef}
			open={active}
			onClose={handleChange}
			title="Activate Easyship account"
			footer={
				<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
						<span>Powered by </span>
						<img src={EasyshipLogo} alt="Easyship" width={68} />
					</div>
					<div style={{ display: 'flex', gap: '6px' }}>
						<Button onClick={handleChange} >Cancel</Button>
						<Button primary onClick={handleChange} >
							Confirm
						</Button>
					</div>
				</div>
			}
		>
			<Modal.Section>

				<div className={styles.title}>You’re signed up!</div>
				<p className={styles.desc}>
					Your Easyship account is activated. Select the carriers and services you want to enable, and choose the relevant shipping service for returns or exchanges.
				</p>
				<div className={styles['divider-layout']}>
					<Divider />
				</div>
				<div className={styles['title2']}>
					Select a carrier and service
				</div>
				<div>123</div>
			</Modal.Section>
		</Modal></>
	);
}
