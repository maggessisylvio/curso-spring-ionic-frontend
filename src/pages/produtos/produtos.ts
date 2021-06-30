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
  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let categoria_id = this.navParams.get('id');
    this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(response => {
        this.items = this.items.concat(response['content']);
        console.log(this.page)
        console.log(this.items)
        this.loadImageUrls(response['content']);
        this.loading.dismiss();
      },
        error => {
          this.loading.dismiss();
        });
  }

  loadImageUrls(items) {
    items.forEach(produto => {
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

  doRefresh(event) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      event.complete();
    }, 1000);
  }

  doInfinite(event) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      event.complete();
    }, 1000);
  }
}
