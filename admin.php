<?php

// Add hooks
add_action('admin_menu', 'addCxenseAdminPage');

function addCxenseAdminPage()  {
    // Add a new submenu under Settings:
    add_options_page('Cxense settings', 'Cxense settings', 'manage_options', 'cxense_settings', 'cxenseSettingsPage');
}

function getOptionOrDefaultCXense($option, $defaultValue = NULL) {
    $configValue = get_option('wp-cxense-' . $option, NULL );
    return (empty($configValue)) ? $defaultValue : $configValue;
}

function setOptionCXense($option, $value) {
    return update_option('wp-cxense-' . $option, $value);
}

function updateCxenseOptions(){

    foreach ($_POST as $key => $value) {
        if ($key != 'submit'){
            setOptionCXense($key, $value);
        }
    }
}

function cxenseSettingsPage(){

    updateCxenseOptions();

    wp_enqueue_style( 'AdminBootstrap', '//cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css', array(), '', 'all' );

    $persistedQueryId = getOptionOrDefaultCXense('dmpPersistedQueryId');
    $siteId = getOptionOrDefaultCXense('siteId');

    $output = <<<HTML
        <div class="container">
            <div class="col-xs-12">
                <form method="POST" >
                  <div class="form-group">
                    <p></p>
                  </div>
                  <div class="form-group">
                    <label for="exampleInputEmail1">Site ID</label>
                    <input type="text" class="form-control" name="siteId" placeholder="SiteID" value="$siteId">
                  </div>
                  <div class="form-group">
                    <label for="exampleInputPassword1">Persisted Query ID(from Site Group)</label>
                    <input type="text" class="form-control" name="dmpPersistedQueryId" placeholder="Persisted Query ID" value="$persistedQueryId">
                  </div>
                  <button type="submit" class="btn btn-primary-outline">Submit</button>
                </form>
            </div>
        </div>
HTML;

    echo $output;
}

