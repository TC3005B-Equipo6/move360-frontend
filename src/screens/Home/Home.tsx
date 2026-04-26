import styles from './Home.module.css';
import { Sidebar } from '../../components/SideBar/SideBar';
import { Header } from '../../components/Header/Header';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';

export default function HomeScreen() {

  return (
    <div className={styles.background}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <Header title="Bienvenido" />
          <ProfileCard name="Juan Pérez" role={''} />
        </div>
        <div>Aquí va el contenido principal</div>
      </div>
    </div>
  );
}