import styles from './Settings.module.css';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function Settings() {
  const [name, setName] = useState('');
  const { user } = useAuthContext();

  return <form></form>;
}
