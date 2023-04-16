var map = L.map('map').setView([53.430127, 14.55], 13);
var marker = L.marker([53.430127, 14.55]).addTo(map);


function getGeolocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function createPuzzleImg() {
    var node = document.getElementById('map');

    domtoimage.toPng(node)
        .then(function(dataUrl) {
            document.getElementById('img').src = dataUrl;
        })
        .catch(function(error) {
            console.error('oops, something went wrong!', error);
        });
}


function showPosition(p) {
    document.getElementById("geo").innerHTML = `Twoje współrzędne:<br> Latitude ${p.coords.latitude}<br> Longitude  ${p.coords.longitude}`;
    var new_cord = new L.LatLng(p.coords.latitude, p.coords.longitude)
    marker.setLatLng(new_cord);
    map.panTo(new_cord);
}

function createPuzzle() {
    document.getElementById('puzzbutt').disabled = true;
    var image = new Image();
    let img = document.getElementById('img');
    image.onload = imageToPuzzle;
    image.src = img.src;
    img.hidden = true;

    var puzzleList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var puzzlePiecesList;

    function imageToPuzzle() {
        var canvasPieces = [];
        var puzzlePieces = [];
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 4; ++j) {
                var canvas = document.createElement('canvas');
                canvas.width = 150;
                canvas.height = 150;

                var context = canvas.getContext('2d');
                context.drawImage(image, j * 150, i * 150, 150, 150, 0, 0, canvas.width, canvas.height);
                canvasPieces.push(canvas.toDataURL());
            }
        }

        for (var c = 0; c < 16; c++) {
            var tile = document.createElement('img');

            tile.id = c;

            tile.src = canvasPieces[c];

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            puzzlePieces.push(tile)
        }

        puzzlePieces.reverse();
        let shuffledpuzzlePieces = puzzlePieces.sort(function() {
            return Math.random() - 0.5;
        });
        document.getElementById('pieces').setAttribute('style', ' ');
        for (var c = 0; c < 16; c++) {
            document.getElementById('pieces').appendChild(shuffledpuzzlePieces[c]);
        }

        for (var c = 0; c < 16; c++) {
            tile = document.createElement('img');
            tile.src = "https://kaczalko.pl/AI1/lab4/blank.png"
            tile.id = 16;
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById('puzzle').appendChild(tile);
        }

        updatePuzzleStatus()

    }


    var currTile;
    var otherTile;

    function dragStart() {
        currTile = this;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragDrop() {
        otherTile = this;
    }

    function updatePuzzleStatus() {
        puzzlePiecesList = document.getElementById('puzzle').getElementsByTagName("img")
        for (var c = 0; c < 16; c++) {
            puzzleList.shift();
            puzzleList.push(Number(puzzlePiecesList[c + 1].id))
        }
        console.log(puzzleList);
    }

    async function isPuzzleSolved() {
        var status = 1;
        for (var c = 0; c < 15; c++) {
            if (puzzleList[c] > puzzleList[c + 1] || puzzleList[c] == puzzleList[c + 1]) {
                status = 0;
            }
        }
        if (status == 1) {
            console.log("sorted")
            let granted = false;

            if (Notification.permission === 'granted') {
                granted = true;
                console.log("granted granted granted")
            } else if (Notification.permission !== 'denied') {
                let permission = await Notification.requestPermission();
                granted = permission === 'granted' ? true : false;
            }
            if (granted) {
                var notification = new Notification({
                    body: "Puzzle ulozone poprawnie"
                });
            } else {
                alert("Puzzle ulozone poprawnie")
            }
        }

    }

    function dragEnd() {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let currId = currTile.id;
        let otherId = otherTile.id;
        currTile.id = otherId;
        otherTile.id = currId;

        updatePuzzleStatus()
        isPuzzleSolved();
    }
}
