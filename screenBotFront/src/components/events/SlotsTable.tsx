import React, { useState } from 'react'
import {
  IconShoppingCart,
  IconLicense,
  IconMessage2,
  IconBellRinging,
  IconMessages,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconUsers,
  IconFileAnalytics,
  IconDatabaseImport,
  IconReceipt2,
  IconReceiptRefund
} from '@tabler/icons-react';
import classes from './SlotsTable.module.css'
import { Button, Grid } from '@mantine/core';

const tabs = [
    { label: 'Notifications'},
    { label: 'Billing' },
    { label: 'Security' },
    { label: 'SSH Keys'  },
    { label: 'Databases' },
    { label: 'Authentication' },
    { label: 'Other Settings' },
  ]

export function SlotsTable({daysArrow}) {
    console.log(daysArrow)
  const [active, setActive] = useState('Billing');

  const links = daysArrow.map((item, index) => (
    <Grid.Col span={12} key={index}>
        <Button>
            {item.getDate() + '.' + (item.getMonth() + 1) + '.' + item.getFullYear()}
        </Button>
    </Grid.Col>
    
    // <div
    //     className={classes.link}
    //     data-active={item.label === active || undefined}
    // //   href={item.link}
    //     key={item.label}
    //     onClick={(event) => {
    //     event.preventDefault();
    //     setActive(item.label);
    //   }}>
    // <span>{item.label}</span>
    // </div>
  ));

  return (
    <Grid>
        {links}
    </Grid>
    //   <div className={classes.navbarMain}></div>
    // </nav>
  );
}