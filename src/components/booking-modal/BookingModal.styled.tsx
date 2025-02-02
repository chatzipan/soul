import Dialog from "@mui/material/Dialog";
import MuiSelect from "@mui/material/Select";
import MuiTextField from "@mui/material/TextField";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { MuiTelInput } from "mui-tel-input";
import styled from "styled-components";

import SoulButton from "../shared/Button";

export const Modal = styled(Dialog)`
  & .MuiDialog-paper {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};

    & * {
      font-family: "Josefin Sans", sans-serif;
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

export const Button = styled(SoulButton)`
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1.5rem;
`;

export const TimeButton = styled(SoulButton)`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1.5rem;
  flex: 1;
`;

export const Select = styled(MuiSelect)`
  min-width: 65px;

  & fieldset {
    border-color: ${({ theme }) => theme.colors.secondary} !important;
    border-width: 0 0 2px !important;
    border-radius: 0 !important;

    &:focus {
      border-color: ${({ theme }) => theme.colors.secondary} !important;
      outline: none;
    }
  }
`;

export const DatePicker = styled(MuiDatePicker)`
  & fieldset {
    border-color: ${({ theme }) => theme.colors.secondary} !important;
    border-width: 0 0 2px !important;
    border-radius: 0 !important;

    &:focus {
      border-color: ${({ theme }) => theme.colors.secondary} !important;
      outline: none;
    }
  }
`;

export const TextField = styled(MuiTextField)`
  & fieldset {
    border-color: ${({ theme }) => theme.colors.secondary} !important;
    border-width: 0 0 2px !important;
    border-radius: 0 !important;

    &:focus {
      border-color: ${({ theme }) => theme.colors.secondary} !important;
      outline: none;
    }
  }
`;

export const TelInput = styled(MuiTelInput)`
  & fieldset {
    border-color: ${({ theme }) => theme.colors.secondary} !important;
    border-width: 0 0 2px !important;
    border-radius: 0 !important;

    &:focus {
      border-color: ${({ theme }) => theme.colors.secondary} !important;
      outline: none;
    }
  }
`;

export const TextArea = styled(MuiTextField)`
  & fieldset {
    border-color: ${({ theme }) => theme.colors.secondary} !important;
    border-width: 2px !important;
    border-radius: 0 !important;

    &:focus {
      border-color: ${({ theme }) => theme.colors.secondary} !important;
      outline: none;
    }
  }
`;
