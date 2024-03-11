/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { ChangeEventHandler, FC, ReactNode } from "react";

interface TInput extends InputProps {
  label?: string;
  isInvalid?: boolean;
  isError?: ReactNode;
  type: string;
  value?: any;
  placeholder?: string;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const InputArea: FC<TInput> = ({
  label,
  type,
  placeholder,
  isError,
  isInvalid,
  value,
  onChange,
  name,
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange && onChange({ target: { name, value } });
  };

  return (
    <FormControl my={"1em"} isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        value={value}
        bg={"gray.50"}
        placeholder={placeholder}
        h={"48px"}
        borderRadius={0}
        onChange={handleChange}
        {...rest}
      />

      <FormErrorMessage>
        <FormErrorIcon /> {isError}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputArea;
