import { Drawer, Form, Modal } from 'antd';
type ModalProps = React.ComponentProps<typeof Modal>;
type DrawerProps = React.ComponentProps<typeof Drawer>;
type FormProps = React.ComponentProps<typeof Form>;
interface CUFormProps {
  container: 'modal' | 'drawer';
  type: 'create' | 'update';
  children: React.ReactNode;
  modalProps?: ModalProps;
  drawerProps?: DrawerProps;
  formProps?: FormProps;
}
export function CUForm({ container, children }: CUFormProps) {
  return container === 'modal' ? (
    <Modal>{children}</Modal>
  ) : (
    <Drawer>{children}</Drawer>
  );
}
