import styles from './DreamTitle.module.css';

const DreamTitle = () => {
  return (
    <div>
    <h3 className={styles.title}>
    <span>Please Start</span>
    <span>From This</span>
    <span>Add Tour</span>
    <div className={styles['scroll-more']}>↓</div>
  </h3>
    </div>
  );
}

export default DreamTitle;
