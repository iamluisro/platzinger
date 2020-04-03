import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { ConversationService } from '../services/conversation.service';
import { timestamp } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { timeout } from 'q';
import { AngularFireStorage } from '@angular/fire/storage/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  img_env: any;
  img: string;
  conversation: any[];
  shake: boolean = false; 
  picture: any = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService, private conversationService: ConversationService, private authenticationService: AuthenticationService, private firebaseStorage: AngularFireStorage) {
    this.friendId = this.activatedRoute.snapshot.params['uid'];
    console.log(this.friendId);
    this.authenticationService.getStatus().subscribe((session) => {
      this.userService.getUserById(session.uid).valueChanges().subscribe((user: User) => {
        this.user = user;
        this.userService.getUserById(this.friendId).valueChanges().subscribe((data: User) => {
          this.friend = data;
          const ids = [this.user.uid, this.friend.uid].sort();
          this.conversation_id = ids.join('|');
          this.getConversation();
        }, (error) => {
          console.log(error);
        });
      });
    });
  }
  

  ngOnInit() {
  }
  sendMessage() {
    const message = {
      uid: this.conversation_id, 
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    };
    this.conversationService.createConversation(message).then( () => {
      this.textMessage = '';
      
    });
  }

  sendZumbido() {
    const message = {
      uid: this.conversation_id, 
      timestamp: Date.now(),
      text: 'zumbido',
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    };
    this.conversationService.createConversation(message).then( () => {});
    this.doZumbido();
  }

  doZumbido() {
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout( () => {
      this.shake = false;
    }, 1000);
  }

  sendImage() {
    const currentPictureId = Date.now();
    const pictures = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url');
    pictures.then((result) => {
      this.picture = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL();
      this.picture.subscribe((p) => {
        const message = {
          uid: this.conversation_id,
          timestamp: Date.now(),
          text: p,
          sender: this.user.uid,
          receiver: this.friend.uid,
          type: 'image'
        }
        this.conversationService.createConversation(message).then(() => { });
      });
    }).catch((error) => {
      console.log(error)
    });
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
}
imageLoaded() {
  // show cropper
}
cropperReady() {
  // cropper ready
}
loadImageFailed() {
  // show message
}


  getConversation() {
    this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe( (data) => {
      this.conversation = data;
      this.conversation.forEach( (message) => {
        if (!message.seen) {
          message.seen = true;
          this.conversationService.editConversation(message);
          if (message.type == 'text') {
            const audio = new Audio('assets/sound/new_message.m4a');
            audio.play();
          } else if (message.type == 'zumbido') { 
            this.doZumbido();
          } else if (message.type == 'img') {
            this.sendImage();
            //console.log(this.doImagen);
          }
         
         
        }
      })
      console.log(data);
    }, (error) => {
      console.log(error);
    })
  };

  getUserNickById(id) {
    if (id === this.friend.uid) {
      return this.friend.name;
    } else {
      return this.user.name;
    }
  }

}

  /* sendImagen()
  {
    const message={
        uid:this.conversation_id,
        timestamp: Date.now(),
        text: null,
        url:null,
        sender:this.user.uid,
        receiver:this.friend.uid,
        type: 'imagen'
    };
    this.conversationService.createConversation(message).then(()=>{}); 
    this.doImagen();
  }

  doImagen(mensaje)
  {
    if(this.croppedImage)
    {
           const currentPictureId = Date.now();
           const picture = this.firebaseStorage.ref('imagenes/'+ currentPictureId + '.jpg').putString(this.croppedImage,'data_url');
           picture.then((result)=>{
           this.img_env=this.firebaseStorage.ref('imagenes/'+ currentPictureId + '.jpg').getDownloadURL();
           this.img_env.subscribe((p)=>{
           this.conversationService.setImagen(mensaje,p).then(()=>{
           }).catch((error)=>
           {
           console.log(error);
           });
           });
     }).catch((error)=>{
  console.log(error);
     });
  } 
  }

  
sendImg() {
  const message = {
    uid: this.conversation_id, 
    timestamp: Date.now(),
    text: null,
    sender: this.user.uid,
    receiver: this.friend.uid,
    type: 'img',
    img_url: null
  };
  this.conversationService.createConversation(message).then( () => {});
  this.shareImg();
}

shareImg() {
    const picture_id = Date.now() ;
    const img = this.firebaseStorage.ref('pictures/' + picture_id + '.jpg').putString(this.croppedImage, 'data_url');
    img.then( () => {
      this.picture = this.firebaseStorage.ref('pictures/' + picture_id + '.jpg').getDownloadURL();
      this.picture.subscribe( (p) => {
        this.conversationService.setImagen(p, this.conversation_id).then( () => {
          alert('Imagen enviada correctamente.');
          console.log(p);
        }).catch( (error) => {
          alert('Hubo un error al tratar de subir una imagen.');
          console.log(error);
        })

      })
      this.croppedImage = ''

    })
  }
*/