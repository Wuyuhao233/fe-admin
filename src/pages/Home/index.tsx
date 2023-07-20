import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim('test home')} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
