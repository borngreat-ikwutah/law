export const firmName = "LEGAL AID LEGAL SERVICES LLC";
export const businessEmail = "legaldocuments19803@yahoo.com";
export const businessPhones = [
  "(866) 356-7238",
  "(866) 838-0117",
  "(877) 217-9029",
] as const;
export const businessPhoneText = businessPhones.join(" / ");
export const businessAddressNotice =
  "Office address not provided. Please call or email for location details.";
export const businessHoursNotice =
  "Please call or email to confirm current hours.";

export function getPhoneNumbers(value?: string): string[] {
  if (!value?.trim()) return [...businessPhones];
  return value
    .split(/\s*(?:\/|;|\||,|·|\n|\r)\s*/)
    .map(item => item.trim())
    .filter(Boolean);
}

export function phoneHref(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 ? `tel:+${digits}` : "";
}
