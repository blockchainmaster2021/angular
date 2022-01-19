import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../../_services';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private utility: UtilityService) {
    this.utility.updatePageSEO(
      'NFT Marketplace | Buy and Sell your NFT, and NFT Money. NFT Collections, Crypto artworks.',
      'Buy, Sell and trade your NFTs and NFT Money Secured with blockchain.'
    );
  }

  ngOnInit(): void {}
}
