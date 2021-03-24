import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';

export type MuiIcon = OverridableComponent<SvgIconTypeMap>;
export interface RouteDescriptor {
    path: string,
    exact?: boolean,
    pageTitle: string,
    icon: MuiIcon,
    render: Function
}
