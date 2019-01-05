<?php
get_header();
pageBanner(array(
    'title' => 'Todos Eventos',
    'subtitle' => 'Leia o que acontece no nosso mundo.'
));
?>

<div class="container container--narrow page-section">
    <?php
    while(have_posts()) {
        the_post();
        get_template_part('template-parts/content-event');
    }
    echo paginate_links();
    ?>
<hr class='section-break'>
<p>Gostaria de relembrar dos eventos passados? <a href="<?php echo site_url('/past-events'); ?>">Verifique nosso arquivo de eventos.</a></p>
</div>
<?php
get_footer();
?>
