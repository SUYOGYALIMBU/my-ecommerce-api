mongodb
- non-structured database
- non-relational database
- nosql
- {name:"ram",address:{
  street:"balaju"
  }}

- { title:"mouse","price":1000,"quantity":5}
- { name:"keyboard","rate":1000,"quantity":5}



postgress/mysql
- structured database
- relational database / tabular database  // rows and columns
- sql
-  name   street   age
   ram     balaju    20

- title: data-type: nullable   price   quantity
  mouse   1000    5
  keyboard 1000   5



  one teacher can coach multiple sports


  


  # docker 
  - docker image  // similar to github repo
  - docker container // similar to git clone  and npm run dev
  - docker-compose.yml  // similar to package.json // this contains configurations of external services we need to run our project


  # docker commands
  - docker compose up  // npm run dev
  - docker compose down  // 
  - docker ps // view the list of currently running docker containers 






  # features
  - api to create products using post api
  - only a logged-in user can create products. 
    - QUESTION: how to identify if a user is logged in or not. 
    - https://www.npmjs.com/package/jsonwebtoken
    - only seller can add products

  - categories
    - only admin can add categories
  - get the list of products
    - filter
      - price
      - name
      - category
      - limit 
      - sorting
      - seller wise filter

    - pagination
    - only seller can add products
    - only that seller who create product can change his/her products
  - admin should verify the products before they are listed.
  - add to cart
  - place order
    - esewa integration
  - images upload
  - 




  # middlewares
  - simply a function which has access to request and response. 
  - can change/modify request/response 
  - also has access to next valid middleware. 