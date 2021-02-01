module.exports.details = function details() {
    return {
        id: "Tdarr_Plugin_AAAA_GigaFyde_convert",
        Stage: "Pre-processing",
        Name: "Convert to H264",
        Type: "Video",
        Operation: "Transcode",
        Description: `Test Plugin`,
        Version: "0.01",
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
    if (file.file_size < 1000 && "video_codec_name" !== "h264") {
        response.FFmpegMode = true;
        response.processFile = true;
        response.preset = `, -c:a copy -c:s srt -c:v libx264 -vsync 0 -crf 21 -metadata:s:v:0 tdarrprocessed=yes -max_muxing_queue_size 9999`;
        response.container = ".mkv";

        response.reQueueAfter = true;
        response.infoLog += `☒File hasn't yet been processed! \n`;
        return response;
    }
    for (let j = 0; j < file.ffProbeData.streams.length; j++) {
        if (typeof file.ffProbeData.streams[0].tags === undefined) {
            response.FFmpegMode = true;
            response.processFile = true;
            response.preset = `, -c:a copy -c:s srt -c:v libx264 -vsync 0 -crf 21 -metadata:s:v:0 tdarrprocessed=yes -max_muxing_queue_size 9999`;
            response.container = ".mkv";

            response.reQueueAfter = true;
            response.infoLog += `☒File hasn't yet been processed! \n`;
            return response;
        }
        if ("TDARRPROCESSED" in file.ffProbeData.streams[0].tags) {
            response.processFile = false;
            response.infoLog += `☑File is already processed! \n`;
            return response;
        } else {
            response.FFmpegMode = true;
            response.processFile = true;
            response.preset = `, -c:a copy -c:s srt -c:v libx264 -vsync 0 -crf 21 -metadata:s:v:0 tdarrprocessed=yes -max_muxing_queue_size 9999`;
            response.container = ".mkv";
            response.reQueueAfter = true;
            response.infoLog += `☒File hasn't yet been processed! \n`;
            return response;
        }
    }
};


