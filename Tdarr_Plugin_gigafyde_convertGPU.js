module.exports.details = function details() {
    return {
        id: "Tdarr_Plugin_gigafyde_convertGPU",
        Stage: "Pre-processing",
        Name: "Convert to H264 NVENC",
        Type: "Video",
        Operation: "Transcode",
        Description: `Converts files to H264 using NVENC and applies a tag so it doesn't process again later`,
        Version: "1.00",
        Link:
            "",
        Tags: "pre-processing,ffmpeg",
    };
}

module.exports.plugin = function plugin(file, librarySettings, inputs) {
    let response = {
        processFile: false,
        preset: "",
        container: ".mkv",
        handBrakeMode: false,
        FFmpegMode: false,
        reQueueAfter: false,
        infoLog: "",
    };
    if (file.file_size < 1000 && file.video_codec_name == "h264") {
        response.infoLog += 'File is already below 1gb and in h264.'
        response.processFile = false
        return response
    }
    if ('Copyright' in file.mediaInfo.track[0]) {
        if (file.mediaInfo.track[0].Copyright == 'giga')
        response.infoLog += 'File has already been proccessed.'
        response.processFile = false
        return response
    } else {
        response.FFmpegMode = true;
        response.processFile = true;
        response.preset = `-hwaccel cuda, -c:a copy -c:s srt -c:v h264_nvenc -vsync 0 -crf 21 -metadata copyright=giga -max_muxing_queue_size 9999`;
        response.container = ".mkv";
        response.reQueueAfter = false;
        response.infoLog += `☒File hasn't yet been processed! \n`;
        return response;
    }
};
