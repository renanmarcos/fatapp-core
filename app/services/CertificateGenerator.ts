import { Subscription } from '../models/Subscription';

export class CertificateGenerator {
  
  private subscription : Subscription;

  constructor(subscription: Subscription) {
    this.subscription = subscription;
  }

  public async sendCertificate() {
    
  }
}