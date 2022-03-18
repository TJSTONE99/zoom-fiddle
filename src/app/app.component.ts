import { AfterContentInit, Component, Inject } from '@angular/core';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements AfterContentInit {
  title = 'zoom-test-app';

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT)private document: Document,
  ) {}

  status: zoomStatus = zoomStatus.init

  client = ZoomMtgEmbedded.createClient();
  
  ngAfterContentInit(): void {
    let meetingSDKElement = document.getElementById('meetingSDKElement');
    
    this.client.init({
    debug: true,
    zoomAppRoot: meetingSDKElement!,
    language: 'en-US',
    customize: {
      meetingInfo: [
      ],
      toolbar: {
      },
      participants: {
        popper: {
          disableDraggable: true
        }
      },
      meeting: {
        popper: {
          disableDraggable: true,
        }
      },
      video: {
        popper: {
          disableDraggable: true
        },
        viewSizes:{
        },
        isResizable: false
      },
      chat: {
        popper: {
          disableDraggable: true
        },
      }
    }
  });

  let allowCheck = true;
  interval(100).subscribe(() => {
    allowCheck = true;
  });

  const observer = new MutationObserver(() => {
    if (allowCheck){
      this.checkZoom();
      allowCheck = false;
    }
  });
  const container = this.document.getElementById('meetingSDKElement');
  observer.observe(<Node>container, {attributes: false, childList: true, subtree: true, characterData: true, attributeOldValue: false, characterDataOldValue: false});

  }

  checkZoom(): void {
    const container = this.document.getElementById('meetingSDKElement');
    if (container){
      const rootZoomContainer = container.children[0];
      if (!rootZoomContainer) return;
      rootZoomContainer.id = 'root-zoom-container';

      const primaryZoomContainer = rootZoomContainer.children[0];
      if (!primaryZoomContainer) return;
      primaryZoomContainer.id = 'primary-zoom-container';

      const topSectionContainer = primaryZoomContainer.children[0];
      if (!topSectionContainer) return;
      topSectionContainer.id = 'top-section-container'

      const topbar = topSectionContainer.children[0];
      if (topbar) topbar.id = 'topbar';

      const joiningText = topSectionContainer.children[1];
      if (joiningText && joiningText.tagName=='P'){
        joiningText.id = 'joining-text-container';
        joiningText.textContent = 'Joining...';
        this.status = zoomStatus.waiting;
      }

      const bottomSection = primaryZoomContainer.children[1];
      if (!bottomSection) return;

      if (bottomSection.tagName === 'DIV' && this.status != zoomStatus.joined){
        const bottomSectionContainer = primaryZoomContainer.children[1];
        bottomSectionContainer.id = 'bottom-section-container';
        rootZoomContainer.addEventListener('mouseenter', ()=>{
          bottomSection.classList.add('display-section');
        });

        rootZoomContainer.addEventListener('mouseleave', ()=>{
          bottomSection.classList.remove('display-section');
        })

        const audioBTN = bottomSection.children[0];
        audioBTN.id = 'audioBTN';

        const videoBTN = bottomSection.children[1];
        videoBTN.id = 'videoBTN';

        const shareScreenBTN = bottomSection.children[2];
        shareScreenBTN.id = 'shareScreenBTN';

        const participentsBTN = bottomSection.children[3];
        participentsBTN.id = 'participentsBTN';

        const moreBTNContainer = bottomSection.children[4];
        moreBTNContainer.id = 'moreBTNContainer';

        const moreBTN = moreBTNContainer.children[0];
        moreBTN.id = 'moreBTN';

        const endCallBTNPrimaryContainer = bottomSection.children[5];
        endCallBTNPrimaryContainer.id = 'endCallBTNPrimaryContainer';

        const endCallBTNContainer = endCallBTNPrimaryContainer.children[0];
        endCallBTNContainer.id = 'endCallBTNContainer';

        const endCallBTN = endCallBTNContainer.children[0];
        endCallBTN.id = 'endCallBTN';
        (<HTMLButtonElement>endCallBTN).onclick = () =>{
         this.status = zoomStatus.ended;
         this.client.leaveMeeting();
       }

        const speakerContainer = topSectionContainer.children[2];
        speakerContainer.classList.add('custom-feed-size');
        
        const newSettingsBTN = this.document.createElement('button');
        newSettingsBTN.classList.add('MuiButtonBase-root');
        newSettingsBTN.classList.add('MuiButton-root');
        newSettingsBTN.classList.add('MuiButton-text');
        newSettingsBTN.classList.add('MuiButton-textSizeSmall');
        newSettingsBTN.classList.add('MuiButton-sizeSmall');
        newSettingsBTN.classList.add('MuiButton-disableElevation');
        newSettingsBTN.style.minWidth = '24px';
        newSettingsBTN.setAttribute('type', 'button');
        newSettingsBTN.setAttribute('title', 'Settings');
        newSettingsBTN.id = 'newSettingsBTN';

        const newSettingBTNLabel = this.document.createElement('span');
        newSettingBTNLabel.classList.add('MuiButton-label');

        const newSettingBTNIconContainer = this.document.createElement('span');
        newSettingBTNIconContainer.classList.add('MuiButton-startIcon');
        newSettingBTNIconContainer.classList.add('MuiButton-iconSizeSmall');
        newSettingBTNIconContainer.style.paddingLeft = '2px';
        newSettingBTNIconContainer.style.paddingRight = '2px';
        newSettingBTNIconContainer.style.marginRight = '0';

        newSettingBTNLabel.appendChild(newSettingBTNIconContainer);

        const newSettingBTNIcon = this.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newSettingBTNIcon.setAttribute('height', '16');
        newSettingBTNIcon.setAttribute('width', '17');
        newSettingBTNIcon.setAttribute('fill', 'none');
        newSettingBTNIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        newSettingBTNIcon.classList.add('MuiSvgIcon-root');
        newSettingBTNIcon.setAttribute('focusable', 'false');
        newSettingBTNIcon.setAttribute('aria-hidden', 'true');

        newSettingBTNIcon.innerHTML = `
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="settings_black_18dp">
              <polygon id="Shape" points="0 0 24 0 24 24 0 24"></polygon>
              <path d="M15.8966322,10.634375 C15.9287589,10.4 15.9448223,10.1578125 15.9448223,9.9 C15.9448223,9.65 15.9287589,9.4 15.8886005,9.165625 L17.5190352,7.93125 C17.6636057,7.821875 17.7037642,7.6109375 17.6154156,7.4546875 L16.0733295,4.8609375 C15.9769491,4.6890625 15.7761567,4.634375 15.5994593,4.6890625 L13.6798835,5.4390625 C13.2782986,5.1421875 12.8526186,4.8921875 12.3787484,4.7046875 L12.0896072,2.7203125 C12.0574804,2.5328125 11.8968465,2.4 11.7040857,2.4 L8.61991362,2.4 C8.42715287,2.4 8.2745506,2.5328125 8.24242381,2.7203125 L7.95328268,4.7046875 C7.47941249,4.8921875 7.04570079,5.15 6.65214758,5.4390625 L4.73257172,4.6890625 C4.55587436,4.6265625 4.35508191,4.6890625 4.25870153,4.8609375 L2.72464718,7.4546875 C2.6282668,7.61875 2.6603936,7.821875 2.82102756,7.93125 L4.45146228,9.165625 C4.41130379,9.4 4.379177,9.6578125 4.379177,9.9 C4.379177,10.1421875 4.3952404,10.4 4.43539889,10.634375 L2.80496416,11.86875 C2.6603936,11.978125 2.6202351,12.1890625 2.70858378,12.3453125 L4.25066983,14.9390625 C4.34705021,15.1109375 4.54784266,15.165625 4.72454002,15.1109375 L6.64411588,14.3609375 C7.04570079,14.6578125 7.47138079,14.9078125 7.94525098,15.0953125 L8.23439211,17.0796875 C8.2745506,17.2671875 8.42715287,17.4 8.61991362,17.4 L11.7040857,17.4 C11.8968465,17.4 12.0574804,17.2671875 12.0815755,17.0796875 L12.3707167,15.0953125 C12.8445869,14.9078125 13.2782986,14.6578125 13.6718518,14.3609375 L15.5914276,15.1109375 C15.768125,15.1734375 15.9689174,15.1109375 16.0652978,14.9390625 L17.6073839,12.3453125 C17.7037642,12.1734375 17.6636057,11.978125 17.5110035,11.86875 L15.8966322,10.634375 Z M10.1619997,12.7125 C8.57172344,12.7125 7.27058833,11.446875 7.27058833,9.9 C7.27058833,8.353125 8.57172344,7.0875 10.1619997,7.0875 C11.7522759,7.0875 13.053411,8.353125 13.053411,9.9 C13.053411,11.446875 11.7522759,12.7125 10.1619997,12.7125 Z" id="Shape" fill="#fff" fill-rule="nonzero" fill-opacity="0.62"></path>
          </g>
        </g>
        `;
        newSettingBTNIconContainer.appendChild(newSettingBTNIcon);

        newSettingsBTN.appendChild(newSettingBTNLabel);

        newSettingsBTN.onclick = () =>{
          (moreBTN as HTMLButtonElement).click();

          const moreDropDown = this.document.getElementById('menu-list-icon-more');
          const settingsBTN = moreDropDown?.children[1];

          (settingsBTN as HTMLButtonElement).click();
        };

        bottomSection.insertBefore(newSettingsBTN, endCallBTNPrimaryContainer);

        const feedContainer = speakerContainer.children[0];
        feedContainer.id = 'custom-feed-container';

        const canvasContainer = feedContainer.children[1];
        canvasContainer.id = 'canvas-container';

        this.status = zoomStatus.joined;

        setTimeout(()=>{   
          console.log('clicking audio');
          (<HTMLButtonElement>audioBTN).click();
        }, 3500);

      } else if (bottomSection.tagName === 'P'){
        const joiningText = primaryZoomContainer.children[1];
        joiningText.id = 'joining-text-container';
        joiningText.textContent = 'Joining...';

        this.status = zoomStatus.waiting;
      }
    }
  }

  joinMeetingFired(): void{
    console.log('triggered');
    this.joinMeeting('5805105540');
  }

  async getSignature(meetingNumber: string): Promise<string> {
    return this.http.post<{signature: string}>('http://zoom-secret-endpoint.herokuapp.com', {
      meetingNumber: meetingNumber,
      role: 0
    }).pipe(map(({signature})=>signature)).toPromise();
  }

  async joinMeeting(meetingNumber: string){
    const sig = await this.getSignature(meetingNumber);
    console.log(sig)
    await this.client.join({
      apiKey: 'VFn5D1LqRlucIUpNZjGuGQ',
      meetingNumber: meetingNumber,
      signature: sig,
      userName: 'john',
      password: 'OEhUM0lkdC9IQnFEYWVtMXlsdGM4QT09'
    });
    
  }
}

enum zoomStatus {
  'init',
  'waiting',
  'joined',
  'ended'
}