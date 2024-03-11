/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SelectProps,
} from "@chakra-ui/react";
import { ChangeEventHandler, FC, ReactNode } from "react";

interface TInput extends SelectProps {
  label?: string;
  isInvalid?: boolean;
  isError?: ReactNode;
  type: string;
  value?: any;
  placeholder?: string;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const SelectField: FC<TInput> = ({
  label,
  type,
  placeholder,
  isError,
  isInvalid,
  value,
  onChange,
  children,
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
      <Select onChange={handleChange} value={value} {...rest}>
        {children}
      </Select>
      <FormErrorMessage>
        <FormErrorIcon /> {isError}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectField;
