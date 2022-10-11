import { history } from 'umi';
import { stringify } from 'querystring';
import { removeUserInfo } from '@/utils/utils';

// 退出登录
export default async () => {
    removeUserInfo()
        if (window.location.pathname !== '/user/login') {
            const search = window.location.href.split('?')[1]
            const hasRedirect = search?.includes?.('redirect')
            history.replace({
                pathname: '/user/login',
                search: stringify({
                    redirect: hasRedirect ? search.split('redirect=')[0] : window.location.href,
                }),
            });
        };

};