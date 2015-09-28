<?php

function editView(){
    $output = <<<HTML
        <div class="container">
            <div class="col-xs-12">
                <form>
                  <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="SiteID">
                  </div>
                  <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                  </div>
                  <button type="submit" class="btn btn-default">Submit</button>
                </form>
            </div>
        </div>
    HTML;
}

function save(){
    $configuration = array([

    ]);
}

echo EditView();
