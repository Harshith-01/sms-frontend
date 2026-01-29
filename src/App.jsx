import { ConfigProvider } from 'antd';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5B7FFF',
          borderRadius: 8,
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;