SELECT * FROM dbshop.tbproducts;
SELECT * FROM dbshop.tbstock;
SELECT * FROM dbshop.tbpreview;
SELECT * FROM dbshop.tbcart;
SELECT * FROM dbshop.tbusers;
SELECT * FROM dbshop.tbsize;
SELECT * FROM dbshop.tbtransaction;
SELECT * FROM dbshop.transaction_detail;
SELECT * FROM dbshop.product_category;

truncate tbcart;
-- truncate tbtransaction_product;
truncate tbtransaction;
truncate transaction_detail;

select td.idtransdetail, td.invoice, p.idproduct, p.name, p.category, sz.size,  td.qty, p.price,  from transaction_detail td
			join tbproducts p 
            on td.idproduct = p.idproduct
            join tbstock st
            on st.idstock = td.idstock
            join tbpreview pr
            on p.id
            join tbsize sz
            on st.idsize = sz.idsize
            where td.iduser = 2;

select c.idcart, st.idstock, p.idproduct, p.name, p.category, sz.size, c.qty, p.price, pr.image from tbproducts p
			join tbcart c 
            on p.idproduct = c.idproduct
            join tbstock st
            on c.idstock = st.idstock
            join tbsize sz
            on sz.idsize = st.idsize
            join tbpreview pr
            on pr.idproduct = td.idproduct
            where c.iduser = 1;
            
            
select *	from tbstock st 
			join tbsize sz
            on st.idsize = sz.idsize
            join tbcart c 
            on c.idstock = st.idstock
            join tbproducts p
            on c.idproduct = p.idproduct;
            
update tbcart set qty = 2 where idcart = 1;

select tt.date, tu.username, tt.status from tbtransaction tt
			join tbusers tu
            on tt.iduser = tu.iduser
            where tt.iduser = 1
            order by tt.noinvoice;
            
-- delete multiple row 
delete from tbcart where (idcart) in (49,50);

SELECT * FROM tbcart WHERE iduser = 3 AND idproduct = 3 AND idstock = 10;

UPDATE tbcart SET qty = 4;


-- insert multiple table 
-- https://www.oracletutorial.com/oracle-basics/oracle-insert-all/
-- 







