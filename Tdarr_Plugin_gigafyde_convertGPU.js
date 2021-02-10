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
    if (file.video_codec_name == 'h263') {
        response.preset = `-c:v h263_cuvid`
    } else if (file.video_codec_name == 'h264') {
        if (file.ffProbeData.streams[0].profile != 'High 10') {
          //Remove HW Decoding for High 10 Profile
        response.preset = `-c:v h264_cuvid`
        }
    } else if (file.video_codec_name == 'mjpeg') {
        response.preset = `c:v mjpeg_cuvid`
    } else if (file.video_codec_name == 'mpeg1') {
        response.preset = `-c:v mpeg1_cuvid`
    } else if (file.video_codec_name == 'mpeg2') {
        response.preset = `-c:v mpeg2_cuvid`
    }
      // skipping this one because it's empty
      //  else if (file.video_codec_name == 'mpeg4') {
      //    response.preset = ``
      //  }
    else if (file.video_codec_name == 'vc1') {
        response.preset = `-c:v vc1_cuvid`
    } else if (file.video_codec_name == 'vp8') {
        response.preset = `-c:v vp8_cuvid`
    } else if (file.video_codec_name == 'vp9') {
        response.preset = `-c:v vp9_cuvid`
    }
    
    if (file.file_size < 2500 && file.video_codec_name == "h264") {
        response.infoLog += 'File is already below 2.5gb and in h264.'
        response.processFile = false
        return response
    }
    if ('Copyright' in file.mediaInfo.track[0]) {
        if (file.mediaInfo.track[0].Copyright == 'giga')
        response.infoLog += 'File has already been proccessed.'
        response.processFile = false
        return response
    }
    for (var i = 0; i < file.ffProbeData.streams.length; i++) {
        if (file.ffProbeData.streams[i].codec_type.toLowerCase() == 'video') {
            if (!['mjpeg', 'png'].includes(file.ffProbeData.streams[i].codec_name.toLowerCase())) { 
                response.preset += `, -map 0:v:${i} -c:v:${i} h264_nvenc -pixel_format yuv420p  -map 0:a -c:a copy -map 0:s? -c:s srt -metadata copyright=giga -max_muxing_queue_size 9999`;
                break
            }
        }
    }
    response.FFmpegMode = true;
    response.processFile = true;
    response.container = ".mkv";
    response.reQueueAfter = false;
    response.infoLog += `☒File hasn't yet been processed! \n`;
    return response;
};
