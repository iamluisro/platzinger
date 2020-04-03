import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }
  createConversation(conversation) {
    return this.angularFireDatabase.object( 'conversations/' + conversation.uid +
    '/' + conversation.timestamp).set(conversation);
  }
  getConversation(uid) {
    return this.angularFireDatabase.list( 'conversations/' + uid);
  }

  editConversation(conversation) {
    return this.angularFireDatabase.object( 'conversations/' + conversation.uid +
    '/' + conversation.timestamp).set(conversation);
  }

  setImagen(conversation, imagen)
  {
      return this.angularFireDatabase.object('conversations/'+conversation.uid+'/'+conversation.timestamp+'/url').set(imagen);
  }
}
