import { ErrorState } from '../../shared/components/ui/ErrorState';

/** /500 —— 服务端/资源异常时的静态兜底页，与路由级错误边界共用同一视图 */
const ServerErrorPage = () => (
  <ErrorState
    code="500"
    title="系统开小差了 💥"
    description="请刷新页面重试，或回到主页继续浏览。"
  />
);

export default ServerErrorPage;
