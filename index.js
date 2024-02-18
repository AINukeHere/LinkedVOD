const broadcasters = [
    { name: '다주', videoUrl: 'https://www.youtube.com/embed/PFBYM4xO6G0?si=bqSYNRodyFPT5R_n&start=5062', timestamp: 30 },
    { name: '침착맨', videoUrl: 'https://www.youtube.com/embed/5ClP7YCZEFg?si=HZwCvfllKImrCsSx&start=746', timestamp: 45 },
    { name: '서새봄', videoUrl: 'https://www.youtube.com/embed/PaSyHk5QI5Y?si=ZryZkz9htA31AVFN', timestamp: 60}
    // 추가 방송인 및 데이터
];

// <!-- 변경된 JavaScript 코드 부분 -->
// 페이지 로드 시 실행되는 함수
window.onload = function() {
    const videoContainer = document.getElementById('videoContainer');
    const relatedListContainer = document.getElementById('relatedListContainer');

    // 첫 번째 방송인의 영상만 초기로드
    const firstBroadcaster = broadcasters[0];
    createVideo(firstBroadcaster);

    // 영상을 동적으로 생성하는 함수
    function createVideo(broadcaster) {
        const iframe = document.createElement('iframe');
        iframe.src = broadcaster.videoUrl;
        iframe.width = "100%";
        iframe.height = "315"; // YouTube의 표준 높이
        iframe.allowfullscreen = true;

        const div = document.createElement('div');
        div.className = 'videoFrame';
        div.appendChild(iframe);

        videoContainer.innerHTML = ''; // 기존 영상 삭제
        videoContainer.appendChild(div);

        displayRelatedBroadcasters(broadcaster);
    }

    // 영상을 클릭했을 때의 이벤트 리스너 추가
    videoContainer.addEventListener('click', function(e) {
        const targetVideo = e.target.closest('.videoFrame');
        if (targetVideo) {
            const broadcaster = broadcasters.find(b => b.videoUrl === targetVideo.querySelector('iframe').src);
            if (broadcaster) {
                if (currentVideo && currentVideo !== targetVideo.querySelector('iframe')) {
                    currentVideo.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                }
                currentVideo = targetVideo.querySelector('iframe');
                displayRelatedBroadcasters(broadcaster);
            }
        }
    });

    // 영상을 클릭했을 때의 함수
    function displayRelatedBroadcasters(selectedBroadcaster) {
        console.log('selectedBroadcaster')
        console.log(selectedBroadcaster)
        // 오른쪽에 유튜브 링크와 정보를 표시하는 부분
        relatedListContainer.innerHTML = ''; // 기존 목록 초기화

        // 현재 영상과 제외한 나머지 방송인 목록을 표시
        broadcasters.filter(b => b.name !== selectedBroadcaster.name).forEach(relatedBroadcaster => {
            
            console.log('relatedBroadcaster')
            console.log(relatedBroadcaster)
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <i class="fas fa-youtube"></i>
              <strong>${relatedBroadcaster.name}</strong> - 
              <a href="javascript:void(0);" onclick="changeVideo('${relatedBroadcaster.videoUrl}', '${relatedBroadcaster.name}', ${relatedBroadcaster.timestamp})">
                Watch at ${relatedBroadcaster.timestamp}s
              </a>`;

            // 현재 재생 중인 영상의 타임스탬프와 동일하면 강조 표시
            // if (relatedBroadcaster.timestamp === currentTimestamp) {
            //   listItem.style.fontWeight = 'bold';
            // }
            relatedListContainer.appendChild(listItem);
        });
    }

    // 영상을 변경하는 함수
    window.changeVideo = function(videoUrl, name, timestamp) {
        const broadcaster = { name, videoUrl, timestamp };
        createVideo(broadcaster);
    };
};