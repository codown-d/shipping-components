import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@shopify/polaris';
import { CloseIcon } from './icons';

import styles from './Drawer.module.scss';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  accessibilityLabel?: string;
  position?: 'bottom' | 'right';
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  accessibilityLabel,
  position = 'bottom'
}) => {
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const positionClass = position === 'bottom' ? styles.bottom : styles.right;

  // 处理ESC键关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  // 处理点击外部区域关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        open
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // 不再需要处理组件挂载，因为不使用createPortal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 处理body滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted) return null;

  // 直接返回div，不使用createPortal
  return (
    <div
      className={`${styles.drawerContainer} ${open ? styles.open : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={accessibilityLabel || title || 'Drawer'}
    >
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={`${styles.drawer} ${positionClass}`}
        ref={drawerRef}
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <Button
            plain
            icon={CloseIcon}
            onClick={onClose}
            accessibilityLabel="Close"
          />
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
