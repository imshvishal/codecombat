import React, { FormEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Mail } from "lucide-react";
import {
  useSendUserActivationMailMutation,
  useSendPasswordResetMailMutation,
  useSendUsernameResetMailMutation,
} from "@/redux/api/endpoints/authApi";
import { toast } from "@/components/ui/use-toast";
enum EmailType {
  USER_ACTIVATION = "user_activation",
  RESET_PASSWORD = "reset_password",
  RESET_USERNAME = "reset_username",
}

interface Props {
  state: any;
  setModalState: any;
}
const EmailModal = ({ state, setModalState }: Props) => {
  const [sendUserActivationMail, { isLoading: userActivationMailIsLoading }] =
    useSendUserActivationMailMutation();
  const [sendPasswordResetMail, { isLoading: passwordResetMailIsLoading }] =
    useSendPasswordResetMailMutation();
  const [sendUsernameResetMail, { isLoading: usernameResetMailIsLoading }] =
    useSendUsernameResetMailMutation();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let send_mail = sendUserActivationMail;
    switch (state.type) {
      case EmailType.USER_ACTIVATION:
        send_mail = sendUserActivationMail;
        break;
      case EmailType.RESET_PASSWORD:
        send_mail = sendPasswordResetMail;
        break;
      case EmailType.RESET_USERNAME:
        send_mail = sendUsernameResetMail;
        break;
    }
    try {
      await send_mail(state.email.toLowerCase()).unwrap();
      toast({
        title: "Email sent successfully",
      });
    } catch (error) {
      toast({
        title: "Email sending failed",
        description: new String(
          Object.values((error as { data: Array<Array<string>> }).data)[0]
        ),
        variant: "destructive",
      });
    }
    setModalState({ ...state, isOpen: false });
  };
  return (
    <Modal
      isOpen={state.isOpen}
      placement="center"
      onClose={() => setModalState({ ...state, isOpen: false })}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Reset</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Input
              autoFocus
              endContent={
                <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              type="email"
              label="Email"
              onChange={(e) =>
                setModalState({ ...state, email: e.target.value })
              }
              placeholder="Enter your email"
              variant="bordered"
              value={state.email}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => setModalState({ ...state, isOpen: false })}
            >
              Close
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={
                userActivationMailIsLoading ||
                passwordResetMailIsLoading ||
                usernameResetMailIsLoading
              }
            >
              Send Email
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export { EmailModal, EmailType };
