<?php
get_header();
pageBanner(array(
    'title' => 'Eventos Ocorridos',
    'subtitle' => 'Relembre dos Eventos já ocorridos'
));
?>

<div class="container container--narrow page-section">
    <?php
    $today = date('Ymd');
        $pastEvents = new WP_Query(array(
          'paged' => get_query_var('paged', 1),
          'post_type' => 'event',
          'meta_key' => 'event_date',//meta or custom
          'orderby' => 'meta_value_num',//numbers
          'order' => 'ASC',
          'meta_query' => array(//multiple filters
            array(//order by event date; dont show past event
              'key' => 'event_date',
              'compare' => '<',
              'value' => $today,
              'type' => 'numeric'
            )
          )
        ));
    while($pastEvents->have_posts()) {
        $pastEvents->the_post();
        get_template_part('template-parts/content-event');
    }
    echo paginate_links(array(
        'total' => $pastEvents->max_num_pages
    ));
    ?>
</div>
<?php
get_footer();
?>

