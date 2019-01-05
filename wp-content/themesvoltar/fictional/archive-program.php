<?php
get_header();
pageBanner(array(
    'title' => 'Todos Programas',
    'subtitle' => 'Temos sempre um curso para você.'
));
?>

<div class="container container--narrow page-section">
  <ul class='link-list min-list'>
    <?php
    while(have_posts()) {
        the_post(); ?>
    <li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
    <?php
    }
    echo paginate_links();
    ?>
  </ul>
</div>
<?php
get_footer();
?>
