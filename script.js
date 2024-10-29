const soundToggle = document.getElementById('soundToggle');
const bgMusic = document.getElementById('bgMusic');
const selectSound = document.getElementById('selectSound');
const container = document.getElementById('container');
const characters = document.querySelectorAll('.character');

let isPlaying = false;
let selectedCharacter = ''; // 선택한 캐릭터를 저장할 변수
let characterElement; // 캐릭터 이미지 요소
let currentDirection = ''; // 현재 방향
let hasItem = false; // 아이템을 가지고 있는지 여부
let monsterElement; // 몬스터 이미지 요소

soundToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        soundToggle.textContent = '노래와 함께 즐거운 모험';
    } else {
        bgMusic.play();
        soundToggle.textContent = '조용히 즐기는 모험';
    }
    isPlaying = !isPlaying;
});

characters.forEach(character => {
    character.addEventListener('click', () => {
        selectSound.currentTime = 0; // 사운드 재생 시 처음부터 시작
        selectSound.play();
        
        selectedCharacter = character.dataset.character; // 선택한 캐릭터 저장
        fadeOut();
    });
});

function fadeOut() {
    container.style.opacity = '0';
    setTimeout(() => {
        fadeIn(); 
    }, 500);
}
function fadeIn() {
    container.innerHTML = ''; // 내용 삭제 후 게임 화면 추가
    container.style.opacity = '1';

    // 중앙 메시지 생성
    const messageBox = document.createElement('div');
    messageBox.style.position = 'absolute';
    messageBox.style.left = '50%';
    messageBox.style.top = '20%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.color = 'black';
    messageBox.style.fontSize = '1rem';
    messageBox.style.fontFamily = 'DOSGothic';
    messageBox.style.zIndex = 200;
    messageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 반투명 배경
    messageBox.style.padding = '20px';
    messageBox.style.borderRadius = '10px';
    messageBox.style.border = '1px solid black';
    messageBox.style.backgroundColor = 'white';
    messageBox.innerHTML = `
        키보드 ← → 방향키를 움직여 이동 <br><br>
        [퀘스트] 아이템을 얻어서 잠만보와 싸우기
    `;
    container.appendChild(messageBox);

    // 캐릭터 이미지 추가
    characterElement = document.createElement('img');
    characterElement.src = `${selectedCharacter}.GIF`; // 선택한 캐릭터의 PNG 사용
    characterElement.style.position = 'absolute';
    characterElement.style.left = '50px';
    characterElement.style.bottom = '100px';
    characterElement.style.width = '120px'; // 캐릭터 크기 설정
    characterElement.style.height = 'auto'; // 비율 유지 (또는 원하는 값을 설정)
    characterElement.style.zIndex = 100;
    container.appendChild(characterElement);

    // 아이템 생성
    const itemElement = document.createElement('img');
    itemElement.src = 'item1.GIF'; // 아이템 이미지 추가 (PNG 형식)
    itemElement.style.position = 'absolute';
    itemElement.style.bottom = '100px';
    itemElement.style.left = 'calc(50% - 50px)'; // 가운데 위치
    itemElement.style.width = '100px'; // 아이템 크기 설정
    itemElement.style.height = 'auto'; // 비율 유지 (또는 원하는 값을 설정)

    container.appendChild(itemElement);

    // 몬스터 생성 (랜덤한 위치)
    createMonster();

    // 키보드 이벤트 리스너 추가
    window.addEventListener('keydown', moveCharacter);
    window.addEventListener('keyup', stopCharacter);

    // 아이템과의 충돌 체크
    const checkItemCollision = setInterval(() => {
        const characterRect = characterElement.getBoundingClientRect();
        const itemRect = itemElement.getBoundingClientRect();

        // 캐릭터와 아이템이 닿으면 아이템 반응
        if (
            characterRect.right > itemRect.left &&
            characterRect.left < itemRect.right &&
            characterRect.bottom > itemRect.top &&
            characterRect.top < itemRect.bottom
        ) {
            hasItem = true; // 아이템을 얻었음을 표시
            container.removeChild(itemElement); // 아이템 제거
            characterElement.src = `${selectedCharacter}-${currentDirection}-item.GIF`; // 아이템을 가진 캐릭터 이미지로 변경
            itemSound.play();
            displayItemMessage(); // 아이템 메시지 표시
            clearInterval(checkItemCollision); // 충돌 체크 중지
        }
    }, 100); // 100ms마다 충돌 체크

    // 몬스터와의 충돌 체크
    const collisionSound = new Audio('collision-sound.wav');

    const checkMonsterCollision = setInterval(() => {
        const characterRect = characterElement.getBoundingClientRect();
        const monsterRect = monsterElement.getBoundingClientRect();
    
        // 캐릭터와 몬스터가 닿으면 화면을 검은색으로 변경
        if (
            characterRect.right > monsterRect.left &&
            characterRect.left < monsterRect.right &&
            characterRect.bottom > monsterRect.top &&
            characterRect.top < monsterRect.bottom
        ) {
            collisionSound.play(); // 충돌 시 효과음 재생
            showChoices(); // 선택지 표시
            clearInterval(checkMonsterCollision); // 충돌 체크 중지
        }
    }, 100); // 100ms마다 충돌 체크
}

// 몬스터 생성 함수
function createMonster() {
    monsterElement = document.createElement('img');
    monsterElement.src = 'monster.GIF'; // 몬스터 이미지 추가 (PNG 형식)
    monsterElement.style.position = 'absolute';
    monsterElement.style.bottom = '100px';
    monsterElement.style.right = '50px'; // 바닥에 위치
    monsterElement.style.width = '200px'; // 몬스터 크기 설정
    monsterElement.style.height = 'auto'; // 비율 유지 (또는 원하는 값을 설정)
    container.appendChild(monsterElement);
}

// 선택지를 표시하는 함수
function showChoices() {
    container.innerHTML = ''; // 기존 요소 모두 제거

    const choiceBox = document.createElement('div');
    choiceBox.style.position = 'absolute';
    choiceBox.style.left = '50%';
    choiceBox.style.top = '50%';
    choiceBox.style.transform = 'translate(-50%, -50%)';
    choiceBox.style.zIndex = 300;
    choiceBox.style.display = 'flex';
    choiceBox.style.flexDirection = 'column';
    choiceBox.style.alignItems = 'center';
    choiceBox.style.paddingTop = '20vh';

    choiceBox.style.backgroundImage = 'url("battle.PNG")';
    choiceBox.style.backgroundSize = 'cover'; // 배경 이미지가 div에 맞게 크기 조정
    choiceBox.style.width = '100vw'; // 원하는 너비와 높이 설정
    choiceBox.style.height = '100vh';

    const introduce = document.createElement('p');
    introduce.innerHTML = '눈 앞에 잠만보가 있다.<br> <br>▽ 가능한 행동 ▽';

    introduce.style.color = 'white';
    introduce.style.fontFamily ='DOSGothic';
    introduce.style.margin = '1vh';
    introduce.style.fontSize = '1.4rem';

    const fightButton = document.createElement('button');
    fightButton.textContent = '';

    // 버튼 스타일 추가
    fightButton.style.marginBottom = '10px';
    fightButton.style.padding = '15px 30px';
    fightButton.style.border = 'none';
    fightButton.style.overflow = 'hidden';
    fightButton.style.transition = 'transform 0.3s';

    // 마우스 올렸을 때 확대 효과
    fightButton.addEventListener('mouseover', () => {
        fightButton.style.transform = 'scale(1.1)';
    });

    // 마우스 벗어났을 때 원래 크기로 복구
    fightButton.addEventListener('mouseout', () => {
        fightButton.style.transform = 'scale(1)';
    });

     // 안에 들어갈 span 요소 생성
     const fightButtonSpan = document.createElement('span');
     fightButtonSpan.textContent = '싸우기';
     fightButtonSpan.style.display = 'block'; // 블록 요소로 처리
     fightButtonSpan.style.fontFamily ='DOSGothic';
     fightButtonSpan.style.fontSize = '1rem';
     fightButtonSpan.style.backgroundColor ='';
     fightButtonSpan.style.border = 'none';
     fightButtonSpan.style.width = '100px';
     fightButtonSpan.style.cursor = 'pointer';
     fightButtonSpan.style.transition = 'background-color 0.3s ease, transform 0.3s ease';

     fightButtonSpan.style.borderRadius = '50px';
     fightButtonSpan.style.borderColor = 'black';
     fightButtonSpan.style.padding = '0 20px'; // 좌우 패딩
     fightButtonSpan.style.animation = 'move-left 2s linear infinite'; // 좌측으로 애니메이션 

    // ::after 효과와 유사한 기능을 JS로 추가
    fightButtonSpan.setAttribute('data-text', '싸우기');

      // 스팬의 애프터 효과 구현
      fightButtonSpan.style.position = 'relative';
      const spanAfter = document.createElement('span');
      spanAfter.textContent = '싸우기';
      spanAfter.style.position = 'absolute';
      spanAfter.style.top = '0';
      spanAfter.style.left = '100%';
      spanAfter.style.display = 'flex';
      spanAfter.style.justifyContent = 'center';
      spanAfter.style.alignItems = 'center';
      spanAfter.style.width = '100%';
      spanAfter.style.height = '100%';
      spanAfter.style.whiteSpace = 'nowrap'; // 텍스트 줄바꿈 방지
      
      
      // fightButton에 스팬 추가
      choiceBox.appendChild(introduce);
      fightButton.appendChild(fightButtonSpan);
      fightButtonSpan.appendChild(spanAfter);

      
  

    // 클릭 시 동작
    fightButton.onclick = () => {
        if (selectedCharacter === 'character1') {
            showEnding('intro7');
             // 캐릭터 1의 결말
        } else if (selectedCharacter === 'character2') {
            showEnding('intro8'); // 캐릭터 2의 결말
        } else if (selectedCharacter === 'character3') {
            showEnding('intro9'); // 캐릭터 3의 결말
        }
    };

        // 애니메이션 CSS 추가 (JS 내에서 스타일 적용)
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes move-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
            }
        `;
        document.head.appendChild(style);

    choiceBox.appendChild(fightButton);

    const fleeButton = document.createElement('button');
    fleeButton.textContent = '도망가기';
    fleeButton.style.marginTop = '10px';
    fleeButton.style.padding = '5px 5px';
    fleeButton.style.fontSize = '1rem';
    fleeButton.style.backgroundColor ='white';
    fleeButton.style.width = '150px';
    fleeButton.style.cursor = 'pointer';
    fleeButton.style.transition = 'background-color 0.3s ease, transform 0.3s ease';
    fleeButton.style.fontFamily= 'DOSGothic';
    fleeButton.style.margin= '0.5vw';
    
    fleeButton.onclick = () => {
        alert("잠만보를 피해 도망쳤습니다!");
        location.reload(); // 새로고침
    };

    choiceBox.appendChild(fleeButton);
    container.appendChild(choiceBox);
}
function showEnding(endingId) {
    hideAll(); // 모든 요소 숨기기
    document.getElementById(endingId).style.display = 'block'; // 선택한 결말 div 보이기

    // 선택한 캐릭터에 맞는 BGM 재생
    if (endingId === 'intro7') {
        playBGM(bgmMap.character1); // 캐릭터 1 BGM
    } else if (endingId === 'intro8') {
        playBGM(bgmMap.character2); // 캐릭터 2 BGM
    } else if (endingId === 'intro9') {
        playBGM(bgmMap.character3); // 캐릭터 3 BGM
    }
}

function hideAll() {
    container.innerHTML = ''; // 기존 요소 모두 제거
    document.getElementById('intro6').style.display = 'none'; // intro6 숨기기
    document.getElementById('intro7').style.display = 'none'; // intro7 숨기기
    document.getElementById('intro8').style.display = 'none'; // intro8 숨기기
    document.getElementById('intro9').style.display = 'none'; // intro9 숨기기
}








const itemSound = new Audio('item-sound.mp3');
function displayItemMessage() {
    const itemMessageBox = document.createElement('div');
    itemMessageBox.style.position = 'absolute';
    itemMessageBox.style.left = '50%';
    itemMessageBox.style.top = '50%';
    itemMessageBox.style.transform = 'translate(-50%, -50%)';
    itemMessageBox.style.color = 'white';
    itemMessageBox.style.fontSize = '1rem';
    itemMessageBox.style.zIndex = 300; // 메시지가 가장 위에 나타나도록 설정
    itemMessageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // 반투명 배경
    itemMessageBox.style.padding = '20px'; // 패딩 추가
    itemMessageBox.style.borderRadius = '5px'; 
    itemMessageBox.style.border = '5px solidwhite'; 
    itemMessageBox.innerHTML = `
        피로회복제를 얻었다! <br>
        <img src="item1.GIF" alt="아이템" style="width: 50px; height: auto;"> <br>
        피로도 -100 체력 +100
    `;
    container.appendChild(itemMessageBox);

    // 3초 후 메시지 사라지기
    setTimeout(() => {
        container.removeChild(itemMessageBox);
    }, 3000);
}

let walkingSound; // 걷는 효과음 변수

// 걷는 효과음을 초기화합니다.
function initSounds() {
    walkingSound = new Audio('running.wav'); // 걷는 소리 파일 경로
    walkingSound.loop = true; // 소리가 반복 재생되도록 설정
}
function moveCharacter(event) {
    const leftPosition = parseInt(characterElement.style.left, 10) || 20; // 현재 위치
    const speed = 10; // 이동 속도 증가

    // 캐릭터의 너비를 고려하여 오른쪽 경계 설정
    const characterWidth = characterElement.offsetWidth;
    const maxPosition = window.innerWidth - characterWidth; // 화면 너비에서 캐릭터 너비를 뺀 값

    if (event.key === 'ArrowLeft') {
        currentDirection = 'left';
        characterElement.src = hasItem ? `${selectedCharacter}-left-item.GIF` : `${selectedCharacter}-left.GIF`; // 왼쪽 이동 GIF
        characterElement.style.left = `${Math.max(0, leftPosition - speed)}px`; // 왼쪽으로 이동 (0 이하로 가지 않도록 제한)
        if (!walkingSound.isPlaying) {
            walkingSound.play(); // 걷는 소리 재생
        }
    } else if (event.key === 'ArrowRight') {
        currentDirection = 'right';
        characterElement.src = hasItem ? `${selectedCharacter}-right-item.GIF` : `${selectedCharacter}-right.GIF`; // 오른쪽 이동 GIF
        characterElement.style.left = `${Math.min(maxPosition, leftPosition + speed)}px`; // 오른쪽으로 이동
        if (!walkingSound.isPlaying) {
            walkingSound.play(); // 걷는 소리 재생
        }
    }
}
function stopCharacter() {
    // 방향키를 놓으면 현재 방향의 정지 상태 PNG를 유지
    if (currentDirection === 'left') {
        characterElement.src = hasItem ? `${selectedCharacter}-left-item-stop.GIF` : `${selectedCharacter}-left-stop.GIF`; // 왼쪽 정지 상태 PNG
    } else if (currentDirection === 'right') {
        characterElement.src = hasItem ? `${selectedCharacter}-right-item-stop.GIF` : `${selectedCharacter}-right-stop.GIF`; // 오른쪽 정지 상태 PNG
    }
    walkingSound.pause(); // 걷는 소리 정지
    walkingSound.currentTime = 0; // 소리 재생 위치를 처음으로 되돌리기
}
// 초기화 함수 호출
initSounds();

// 이벤트 리스너 등록
document.addEventListener('keydown', moveCharacter);
document.addEventListener('keyup', stopCharacter);


// 인트로 순서 제어
function nextIntro(introNumber) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById('intro' + introNumber).style.display = 'block';
}

//인트로 효과음
document.querySelectorAll('.introButton').forEach(button => {
    button.addEventListener('click', () => {
        const sound = new Audio(button.getAttribute('data-sound'));
        const duration = parseInt(button.getAttribute('data-duration'), 10);

        sound.play();

        // 지정된 시간만큼 재생 후 멈춤
        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0; // 재생 위치를 처음으로 초기화
        }, duration);
    });
});

//효과음 추가용 스크립트
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.sound-button2');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const soundFile = button.getAttribute('data-sound');
            playSound(soundFile);
        });
    });
});

function playSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
}

const dialogues = {
    1: ["삐리릭", "삐리릭", "아... 학교 가야지", "엥 여기가 어디야", "학교 쉬려나?", "(창문을 클릭해보자)"],
    2: ["빠빠빠", "빠빠빠 빠빠 빠빠빠빠 굿모닝", "하... 둥근해 또 떴네", "…? 여기도 지하철 다니나", "(창문을 클릭하세요)", "(창문을 클릭하세요)"],
    3: ["...z", "... .... .... ...", "....", "z Z Z ....", "음... ...."]
};
let dialogueIndex = { 1: 0, 2: 0, 3: 0 };
let typingIndex = { 1: 0, 2: 0, 3: 0 };
let typingInterval;

function typeText(example) {
    const dialogueText = document.getElementById(`dialogueText${example}`);
    dialogueText.innerHTML = dialogues[example][dialogueIndex[example]].substring(0, typingIndex[example]++);

    if (typingIndex[example] > dialogues[example][dialogueIndex[example]].length) {
        clearInterval(typingInterval);
    }
}

function nextDialogue(example) {
    // 효과음 재생
    const clickSound = document.getElementById('clickSound');
    clickSound.currentTime = 0; // 재생 위치 초기화
    clickSound.play();

    if (dialogueIndex[example] === dialogues[example].length - 1) {
        document.querySelector(`#dialogueBox${example} .next-button`).style.display = 'none';
        if (example === 3) {
            document.getElementById('normalEndingButton').style.display = 'block';
        }
    } else {
        dialogueIndex[example]++;
    }

    typingIndex[example] = 0;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => typeText(example), 100);
}

function nextIntro(introNumber) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById('intro' + introNumber).style.display = 'block';
}
// 초기화: 첫 번째 대화 예시 시작
nextDialogue(1);
    

function reload() {
    setTimeout(() => {
        location.reload(); // 2초 후 페이지 새로고침
    }, 1500);
}

const bgmMap = {
    character1: 'end1.mp3', // 캐릭터 1의 BGM 파일
    character2: 'end2.mp3', // 캐릭터 2의 BGM 파일
    character3: 'end3.mp3'  // 캐릭터 3의 BGM 파일
};

function playBGM(bgmFile) {
    const audio = new Audio(bgmFile); // 새 오디오 객체 생성
    audio.play(); // 음악 재생
}