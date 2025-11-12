import type { Api } from "@jellyfin/sdk";
import type {
  BaseItemDto,
  MediaSourceInfo,
} from "@jellyfin/sdk/lib/generated-client/models";
import { Bitrate } from "@/components/BitrateSelector";
import { generateDeviceProfile } from "@/utils/profiles/native";
import { getDownloadStreamUrl, getStreamUrl } from "./getStreamUrl";

export const getDownloadUrl = async ({
  api,
  item,
  userId,
  mediaSource,
  maxBitrate,
  audioStreamIndex,
  subtitleStreamIndex,
  deviceId,
  videoCodec, // optional preference forwarded from UI
}: {
  api: Api;
  item: BaseItemDto;
  userId: string;
  mediaSource: MediaSourceInfo;
  maxBitrate: Bitrate;
  audioStreamIndex: number;
  subtitle_stream_index: number;
  subtitleStreamIndex: number;
  deviceId: string;
  videoCodec?: string;
}): Promise<{
  url: string | null;
  mediaSource: MediaSourceInfo | null;
} | null> => {
  // First, ask for stream info using a "native" device profile to see if direct download is possible
  const streamDetails = await getStreamUrl({
    api,
    item,
    userId,
    startTimeTicks: 0,
    maxStreamingBitrate: maxBitrate.value,
    deviceProfile: generateDeviceProfile(),
    audioStreamIndex,
    subtitleStreamIndex,
    mediaSourceId: mediaSource.Id,
  });

  if (maxBitrate.key === "Max" && !streamDetails?.mediaSource?.TranscodingUrl) {
    console.log("Downloading item directly");
    return {
      url: `${api.basePath}/Items/${item.Id}/Download?api_key=${api.accessToken}`,
      mediaSource: streamDetails?.mediaSource ?? null,
    };
  }

  // Otherwise request a download stream URL — forward videoCodec preference if provided
  const downloadStreamDetails = await getDownloadStreamUrl({
    api,
    item,
    userId,
    mediaSourceId: mediaSource.Id,
    deviceId,
    maxStreamingBitrate: maxBitrate.value,
    audioStreamIndex,
    subtitleStreamIndex,
    videoCodec,
  });

  return {
    url: downloadStreamDetails?.url ?? null,
    mediaSource: downloadStreamDetails?.mediaSource ?? null,
  };
};