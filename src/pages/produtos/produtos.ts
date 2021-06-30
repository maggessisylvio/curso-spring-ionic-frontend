import { Component } from '@angular/core';
import { Loading } from 'ionic-angular';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  loading: Loading = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let categoria_id = this.navParams.get('id');
    this.presentLoading();
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        this.items = response['content'];
        this.loading.dismiss();
        this.loadImageUrls();
      },
        error => { });
  }

  loadImageUrls() {
    this.items.forEach(produto => {
      this.produtoService.getSmallImageFromBucket(produto.id)
        .subscribe(response => {
          produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${produto.id}-small.jpg`
        },
          error => { });
    });
  }

  showDetail(produto_id: string) {
    this.navCtrl.push('ProdutoDetailPage', { id: produto_id });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: "Aguarde..."
    });
    await this.loading.present();
  }
}
