import React from "react";
import { View } from "react-native";
import { Text } from "./common/Text";
import { PlatformDropdown, type OptionGroup } from "./PlatformDropdown";

export const CODEC_OPTIONS = [
  { label: "h264", value: "h264" },
  { label: "h265 (HEVC)", value: "hevc" },
];

export default function CodecSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  const groups: OptionGroup[] = [
    {
      label: "Codec",
      options: CODEC_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
    },
  ];

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ marginBottom: 6 }}>Codec</Text>
      <PlatformDropdown
        groups={groups}
        value={value}
        onValueChange={(v) => onChange(String(v))}
      />
    </View>
  );
}