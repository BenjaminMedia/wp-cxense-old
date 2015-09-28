<?php
/*
    Plugin Name: CXense for WordPress
    Description: CXense integration for WordPress
    Author: Frederik Rabøl of Bonnier Interactive
    Version: 0.5
    Author URI: http://bonnierpublications.com
*/

require_once(__DIR__."/admin.php");




function configurationDisplay(){
    return array(
        'interestPersistedQueryId' => getOptionOrDefaultCXense('interestPersistedQueryId', false),
        'interestedCategories' => getOptionOrDefaultCXense('interestedCategories', []),
        'interestsNumber' => getOptionOrDefaultCXense('interestsNumber', 1),
        'minWeight' => 0,
        'dmpPersistedQueryId' => getOptionOrDefaultCXense('dmpPersistedQueryId',false)
    );
}

function implementScripts() {
    implementTracking();
    implementDisplay();
}


//CREATE HOOK FOR PRINTING SCRIPTS TO PAGE


function implementDisplay() {

    $configuration = configurationDisplay();

    if($configuration['dmpPersistedQueryId'] != false) {

        $cxenseDisplayScript = "
            <script>
                var something = new cxense(" . json_encode($configuration) . ");
                something.load();
            </script>
            ";
        echo  $cxenseDisplayScript;
    }
}

function implementMainScript(){

    $scriptUrl = plugin_dir_url(__FILE__).'js/cxenseImplementation.js';
    $script = "<script type='text/javascript' src='$scriptUrl' ></script>";
    echo $script;

}

function implementTracking(){

    $siteId = getOptionOrDefaultCXense('siteId', false);

    if($siteId) {

        $cxenseTracking = "
        <!-- Cxense script begin -->
        <script type='text/javascript''>
            var cX = cX || {}; cX.callQueue = cX.callQueue || [];
            cX.callQueue.push(['setSiteId', '$siteId']);
            cX.callQueue.push(['sendPageViewEvent']);
        </script>
        <script type='text/javascript'>
            (function(d,s,e,t){e=d.createElement(s);e.type='text/java'+s;e.async='async';
                e.src='http'+('https:'===location.protocol?'s://s':'://')+'cdn.cxense.com/cx.js';
                t=d.getElementsByTagName(s)[0];t.parentNode.insertBefore(e,t);})(document,'script');
        </script>
        <!-- Cxense script end -->";
        echo $cxenseTracking;

    }

}

add_action('wp_footer','implementScripts', 1200);
add_action('wp_enqueue_scripts','implementMainScript');