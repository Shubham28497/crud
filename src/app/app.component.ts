import { Component,OnInit,ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/services/api.service';
import { DailogComponent } from './dailog/dailog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness','price','comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  title = 'crud';
  constructor(private dialog:MatDialog, private apiService:ApiService){}
  ngOnInit(): void {
    this.getAllProducts()
  }
  openDialog() {
    this.dialog.open(DailogComponent, {
     width:"30%"
    }).afterClosed().subscribe(val=>{
        if(val==='save'){
          this.getAllProducts()
        }
    })
  }
  getAllProducts(){
   this.apiService.getProduct()
   .subscribe({
    next:(res)=>{
      console.log(res)
      this.dataSource=new MatTableDataSource(res)
      this.dataSource.paginator=this.paginator
      this.dataSource.sort=this.sort
    },
    error:(err)=>{
      alert("Error")
    }
   })  
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editProduct(row:any){
  this.dialog.open(DailogComponent,{
    width:'30%',
    data:row
  }).afterClosed().subscribe(val=>{
    if(val==='update'){
      this.getAllProducts()
    }
})
  }
  deleteProduct(id:number){
    this.apiService.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        alert("Product Deleted successfully")
        this.getAllProducts()
      },
      error:()=>{
        alert("Error while deleting the product")
      }
    })
  }
}
