require.context('../css');
require.context('../img');
import '../css/media_queries.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.min';

const POINT_MAP = {825:488, 835:505, 845:522, 855:537, 865:552, 875:567, 885:581, 895:594, 905:607, 915:619, 925:631, 935:642, 945:653, 955:663, 965:673, 975:682, 985:691, 995:699, 1005:707, 1015:715, 1025:723, 1035:730, 1045:736, 1055:742, 1065:748, 1075:754, 1085:759, 1095:764, 1105:769, 1115:773, 1125:778, 1135:782, 1145:786, 1155:789, 1165:792, 1175:795, 1185:798, 1195:800, 1205:803, 1215:805, 1225:806, 1235:808, 1245:810, 1255:811, 1265:812, 1275:813, 1285:813, 1295:814, 1305:814, 1315:814, 1325:813, 1335:812, 1345:811, 1355:811, 1365:810, 1375:809, 1385:807, 1395:805, 1405:804, 1415:802, 1425:799, 1435:797, 1445:794, 1455:792, 1465:789, 1475:785, 1485:782, 1495:778, 1505:774, 1515:770, 1525:766, 1535:761, 1545:757, 1555:752, 1565:746, 1575:740, 1585:734, 1595:728, 1605:721, 1615:714, 1625:707, 1635:700, 1645:692, 1655:683, 1665:674, 1675:665, 1685:656, 1695:646, 1705:636, 1715:624, 1725:613, 1735:601, 1745:588, 1755:575, 1765:561, 1775:547, 1785:530, 1795:514, 1805:496, 1815:479, 1825:459, 1835:439, 1845:417, 1855:392, 1865:367, 1875:340, 1885:310, 1895:275, 1905:235, 1915:195};

const MAP_COORDS = {
  'LA': {lat: 34.0792975, lng: -118.3639118},
  'NY': {lat: 40.7096473, lng: -73.9554264},
  'BO': {lat: 42.3378252, lng: -71.0946046},
  'DE': {lat: 42.3526257, lng: -83.2392888}
};

let SECTIONS = new Map();

const sectionsMapSetup = () => {
  Array.from(document.querySelectorAll('header nav > a')).map(item => {
    const sectionID = item.getAttribute('id').split('-')[0];
    const section = document.getElementById(sectionID);
    const sectionTop = section.offsetTop - section.clientTop - 20;

    SECTIONS.set(sectionID, sectionTop);
  });
};

const navMenuSetup = () => {
  const links = document.querySelectorAll('nav > a');

  links.forEach(link => {
    link.addEventListener('click', function() {
      const clickedID = this.getAttribute('id').split('-')[0];
      const headerHeight = document.getElementsByTagName('header')[0].offsetHeight;
      const scrollLength = SECTIONS.get(clickedID) - headerHeight;

      window.scrollTo(0, scrollLength);
      setTimeout(() => activeMenuChanger(document.getElementById(`${clickedID}-link`)), 600);
    });
  });
};

const navMenuBurgerSetup = () => {
  const burgerIcon = document.getElementById('header__burger-icon');

  burgerIcon.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    const burgerMenu = document.getElementById('header__nav-burger');

    if (burgerMenu.classList.contains('active')) {
      burgerMenu.classList.remove('active');
    } else {
      burgerMenu.classList.add('active');

      const closeBurgerListener = function () {
        burgerMenu.classList.remove('active');
        document.removeEventListener('click', closeBurgerListener);
      };
      document.addEventListener('click', closeBurgerListener);
    }
  })
};

const activeMenuChanger = (element) => {
  if (!element.classList.contains('active')) {
    document.querySelector('header nav > a.active').classList.remove('active');
    element.classList.add('active');
  }
};

const logoSetup = () => {
  const logos = Array.from(document.getElementsByClassName('logo'));

  logos.forEach(link => {
    link.addEventListener('click', function() {
      window.scrollTo(0, 0);
      setTimeout(() => activeMenuChanger(document.getElementById('home-link')), 600);
    });
  });
};

const sliderSetup = () => {
  $('.slider-section__video').slick({dots: true})
    .on('beforeChange', function(event, slider, currentSlide, nextSlide) {
      const currentPlayer = `player${currentSlide}`;
      const nextPlayer = `player${nextSlide}`;

      window[currentPlayer].pauseVideo();
      window[nextPlayer].playVideo();
    });
};

const pausePlayer = () => {
  if (window.YT.loaded) {
    ['player0', 'player1', 'player2'].forEach(item => {
      if (window[item].B && window[item].getPlayerState() === 1) window[item].pauseVideo();
    });
  }
};

const movePoint = (point, pointMap, scrollTop) => {
  const isValueInMap = pointMap[scrollTop];
  let leftValue = null;

  if (isValueInMap) {
    leftValue = isValueInMap;
  } else {
    const closestLow = Math.trunc(scrollTop / 10) * 10 + 5;
    const closestHigh = closestLow + 10;
    const equalPart = (scrollTop - closestLow) / 10;

    leftValue = ((pointMap[closestHigh] - pointMap[closestLow]) * equalPart) + pointMap[closestLow];
  }
  point.style.bottom = `${795 - scrollTop}px`;
  point.style.left = `${leftValue}px`;
};

const mapLinksSetup = () => {
  const links = document.querySelectorAll('#info__city-links > li');

  links.forEach(link => {
    link.addEventListener('click', function() {
      const clickedID = this.getAttribute('id');

      window.map.setCenter(MAP_COORDS[clickedID]);
      new google.maps.Marker({position: MAP_COORDS[clickedID], map: window.map, icon: 'img/Map-marker.svg'});

      document.querySelector('#info__city-links > li.current').classList.remove('current');
      this.classList.add('current');

      document.getElementById('info__sub-title').innerText = this.querySelector('.text__address').innerText;

      if (window.innerWidth > 785) {
        document.querySelector('.office-contacts__card.current').classList.remove('current');
        document.getElementById(`${clickedID}-contacts`).classList.add('current');
      } else {
        document.querySelector('.office-contacts-tablet__card.current').classList.remove('current');
        document.getElementById(`${clickedID}-contacts-tablet`).classList.add('current');
      }

    });
  });
};

const pointMoveHandler = (scrollPosition) => {
  const point = document.getElementsByClassName('image__trajectory-point')[0];
  //pointScrollTop = point.offsetTop + (point.offsetHeight/2) + (this.innerHeight/2);
  const pointScrollTop = 845;
  const pointScrollBot = 1915;

  switch (true) {
    case (scrollPosition > pointScrollTop && scrollPosition < pointScrollBot):
      movePoint(point, POINT_MAP, scrollPosition);
      break;
    case (scrollPosition >= pointScrollBot):
      point.style.bottom = '-1120px';
      point.style.left = '195px';
      break;
    default:
      point.style.bottom = '-50px';
      point.style.left = '522px';
  }
};

const screenMiddle = window.innerHeight / 2;

const activeMenuHandler = (scrollPosition) => {
  switch (true) {
    case (scrollPosition < (SECTIONS.get('services') - screenMiddle)):
      activeMenuChanger(document.getElementById('home-link'));
      break;
    case (scrollPosition >= (SECTIONS.get('services') - screenMiddle) && scrollPosition < (SECTIONS.get('team') - screenMiddle)):
      activeMenuChanger(document.getElementById('services-link'));
      break;
    case (scrollPosition >= (SECTIONS.get('team') - screenMiddle) && scrollPosition < (SECTIONS.get('contacts') - screenMiddle)):
      activeMenuChanger(document.getElementById('team-link'));
      break;
    case (scrollPosition >= (SECTIONS.get('contacts') - screenMiddle)):
      activeMenuChanger(document.getElementById('contacts-link'));
      break;
  }
};

const scrollPageTop = () => {
  window.scrollTo(0, 0)
};

$(document).ready(function() {
  scrollPageTop();
  sectionsMapSetup();
  navMenuSetup();
  logoSetup();
  navMenuBurgerSetup();
  sliderSetup();
  mapLinksSetup();


  $(window).scroll(function() {
    const scrollPosition = this.scrollY;

    pausePlayer();
    if (window.innerWidth > 1100) pointMoveHandler(scrollPosition);
    if (window.innerWidth > 1024) activeMenuHandler(scrollPosition);
  });
});
