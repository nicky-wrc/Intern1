<?php
/*
Plugin Name: TBS Quote Generator (v.3.0)
Description: TBS Quote Generator Wordpress Plugin  
Version: 3.0
Author: TBS Dev
*/

require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

// Enqueue scripts and styles
function quote_generator_enqueue_scripts()
{
    // Enqueue Bootstrap CSS
    wp_enqueue_style('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css');

    // Enqueue custom stylesheet
    wp_enqueue_style('quote-generator-style', plugin_dir_url(__FILE__) . 'assets/css/style.css');

    // Enqueue jQuery (required for Bootstrap JavaScript)
    wp_enqueue_script('jquery');

    // Enqueue Bootstrap JavaScript
    wp_enqueue_script('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js', array('jquery'), '4.6.2', true);

    // Enqueue custom JavaScript
    wp_enqueue_script(
        'quote-generator-script',
        plugin_dir_url(__FILE__) . 'assets/js/script.js',
        array('jquery'),
        '1.0',
        true
    );

    wp_localize_script(
        'quote-generator-script',
        'serviceData',
        array(
            'json' => plugin_dir_url(__FILE__) . 'assets/js/services.json'
        )
    );

    wp_localize_script(
        'quote-generator-script',
        'teamMemberData',
        array(
            'json' => plugin_dir_url(__FILE__) . 'assets/js/team-members.json'
        )
    );
}
add_action('wp_enqueue_scripts', 'quote_generator_enqueue_scripts');

register_activation_hook(__FILE__, 'create_quote_history_table');

function create_quote_history_table()
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'quote_history';

    $sql = "CREATE TABLE IF NOT EXISTS  $table_name (
    id mediumint(9) NOT NULL AUTO_INCREMENT,
    quotation_date datetime DEFAULT CURRENT_TIMESTAMP,
    details text,
    user_id mediumint(9),
    running_number text,
    revision_number int DEFAULT 0,
    PRIMARY KEY (id)
);";

    dbDelta($sql);
}

function add_quote_history($details, $running_number, $revision_number)
{
    global $wpdb;

    if (is_user_logged_in()) {
        $current_user = wp_get_current_user();
        $table_name = $wpdb->prefix . 'quote_history';

        $data = array(
            'details' => $details,
            'user_id' => $current_user->ID,
            'running_number' => $running_number,
            'revision_number' => $revision_number,
        );

        $wpdb->insert(
            $table_name,
            $data
        );
    }
}

function get_number_of_quotes()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'quote_history';
    $current_year = date('Y');
    $sql = "SELECT COUNT(*) FROM $table_name WHERE YEAR(quotation_date) = $current_year";
    $result = $wpdb->get_var($sql);
    return $result;
}

function get_number_of_revision($running_number)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'quote_history';
    $sql = "SELECT MAX(revision_number) FROM $table_name WHERE running_number = '$running_number'";
    $result = $wpdb->get_var($sql);
    return $result;
}

// Add shortcode to render the quote generator form
function render_quote_generator_form()
{
    ob_start();
    include(plugin_dir_path(__FILE__) . 'templates/quote-generator-form.php');
    return ob_get_clean();
}
add_shortcode('quote_generator_form', 'render_quote_generator_form');

use Dompdf\Dompdf;
use Dompdf\Options;

function logMessage($message)
{
    $logFile = 'C:\Users\Admin\Local Sites\tbs-price-quotation-generator2\app\public\wp-content\plugins\TBS_Price_Quotation_Generator\logfile.log'; // Specify the path to your log file
    $timestamp = date('Y-m-d H:i:s');
    //error_log("[$timestamp] $message\n", 3, $logFile);
}

function process_quote_form()
{
    logMessage("Starting quote form processing");

    // Ensure Dompdf library is included
    require_once 'vendor/autoload.php';

    // $quotation_date = isset($_POST['quotation_date']) ? $_POST['quotation_date'] : '';
    // $quotation_valid_date = isset($_POST['quotation_valid_date']) ? $_POST['quotation_valid_date'] : '';
    // $project_desc = isset($_POST['project_desc']) ? $_POST['project_desc'] : '';
    // $company_name = isset($_POST['company_name']) ? $_POST['company_name'] : '';
    // $full_name = isset($_POST['full_name']) ? $_POST['full_name'] : '';
    // $company_address = isset($_POST['company_address']) ? $_POST['company_address'] : '';
    // $company_email = isset($_POST['company_email']) ? $_POST['company_email'] : '';
    // $company_phone = isset($_POST['company_phone']) ? $_POST['company_phone'] : '';
    // $client_name = isset($_POST['client_name']) ? $_POST['client_name'] : '';
    // $client_address = isset($_POST['client_address']) ? $_POST['client_address'] : '';
    // $client_email = isset($_POST['client_email']) ? $_POST['client_email'] : '';
    // $client_phone = isset($_POST['client_phone']) ? $_POST['client_phone'] : '';
    // $customer_tax_id = isset($_POST['customer_tax_id']) ? $_POST['customer_tax_id'] : '';
    // $remark = isset($_POST['remark']) ? $_POST['remark'] : '';
    // $discount_type = isset($_POST['discount_type']) ? $_POST['discount_type'] : '';
    // $discount = isset($_POST['discount']) ? $_POST['discount'] : '';
    // $vat_percentage = isset($_POST['vat_percentage']) ? $_POST['vat_percentage'] : '';
    // $selected_currency = isset($_POST['currency']) ? $_POST['currency'] : 'THB'; // Default to THB if not set
    // $column_to_print = isset($_POST['column_to_print']) ? $_POST['column_to_print'] : array();

    // ===== Array fields (services/items) =====
    $service_display_name = isset($_POST['service_display_name']) && is_array($_POST['service_display_name'])
        ? array_map('sanitize_text_field', array_map('wp_unslash', $_POST['service_display_name']))
        : array();

    $service_group_id = isset($_POST['service_group_id']) && is_array($_POST['service_group_id'])
        ? array_map('sanitize_text_field', array_map('wp_unslash', $_POST['service_group_id']))
        : array();

    $item_descriptions = isset($_POST['item_descriptions']) && is_array($_POST['item_descriptions'])
        ? array_map('sanitize_textarea_field', array_map('wp_unslash', $_POST['item_descriptions']))
        : array();

    $quotation_date = isset($_POST['quotation_date'])
        ? sanitize_text_field(wp_unslash($_POST['quotation_date']))
        : '';
    logMessage("Quotation Date: " . $quotation_date);

    $quotation_valid_date = isset($_POST['quotation_valid_date'])
        ? sanitize_text_field(wp_unslash($_POST['quotation_valid_date']))
        : '';
    logMessage("Quotation Valid Date: " . $quotation_valid_date);

    $revised_quotation = isset($_POST['revised_quotation'])
        ? sanitize_text_field(wp_unslash($_POST['revised_quotation']))
        : '';
    logMessage("Revised Quotation: " . $revised_quotation);

    $running_number = isset($_POST['running_number'])
        ? sanitize_text_field(wp_unslash($_POST['running_number']))
        : '';
    logMessage("Historical Running Number: " . $running_number);

    $project_desc = isset($_POST['project_desc'])
        ? sanitize_textarea_field(wp_unslash($_POST['project_desc']))
        : '';
    logMessage("Project Description: " . $project_desc);

    $company_name = isset($_POST['company_name'])
        ? sanitize_text_field(wp_unslash($_POST['company_name']))
        : '';
    logMessage("Company Name: " . $company_name);

    $full_name = isset($_POST['full_name'])
        ? sanitize_text_field(wp_unslash($_POST['full_name']))
        : '';
    logMessage("Full Name: " . $full_name);

    $company_address = isset($_POST['company_address'])
        ? sanitize_textarea_field(wp_unslash($_POST['company_address']))
        : '';
    logMessage("Company Address: " . $company_address);

    $company_email = isset($_POST['company_email'])
        ? sanitize_email(wp_unslash($_POST['company_email']))
        : '';
    logMessage("Company Email: " . $company_email);

    $company_phone = isset($_POST['company_phone'])
        ? sanitize_text_field(wp_unslash($_POST['company_phone']))
        : '';
    logMessage("Company Phone: " . $company_phone);

    $client_name = isset($_POST['client_name'])
        ? sanitize_text_field(wp_unslash($_POST['client_name']))
        : '';
    logMessage("Client Name: " . $client_name);

    $client_address = isset($_POST['client_address'])
        ? sanitize_textarea_field(wp_unslash($_POST['client_address']))
        : '';
    logMessage("Client Address: " . $client_address);

    $client_email = isset($_POST['client_email'])
        ? sanitize_email(wp_unslash($_POST['client_email']))
        : '';
    logMessage("Client Email: " . $client_email);

    $client_phone = isset($_POST['client_phone'])
        ? sanitize_text_field(wp_unslash($_POST['client_phone']))
        : '';
    logMessage("Client Phone: " . $client_phone);

    $customer_tax_id = isset($_POST['customer_tax_id'])
        ? sanitize_text_field(wp_unslash($_POST['customer_tax_id']))
        : '';
    logMessage("Customer Tax ID: " . $customer_tax_id);

    $remark = isset($_POST['remark'])
        ? sanitize_textarea_field(wp_unslash($_POST['remark']))
        : '';
    logMessage("Remark: " . $remark);

    $discount_type = isset($_POST['discount_type'])
        ? sanitize_text_field(wp_unslash($_POST['discount_type']))
        : '';
    logMessage("Discount Type: " . $discount_type);

    $discount = isset($_POST['discount'])
        ? sanitize_text_field(wp_unslash($_POST['discount']))
        : '';
    logMessage("Discount Value: " . $discount);

    $vat_percentage = isset($_POST['vat_percentage'])
        ? sanitize_text_field(wp_unslash($_POST['vat_percentage']))
        : '';
    logMessage("VAT Percentage: " . $vat_percentage);

    $selected_currency = isset($_POST['currency'])
        ? sanitize_text_field(wp_unslash($_POST['currency']))
        : 'THB';
    logMessage("Selected Currency: " . $selected_currency);

    // array field
    $column_to_print = isset($_POST['column_to_print']) && is_array($_POST['column_to_print'])
        ? array_map('sanitize_text_field', array_map('wp_unslash', $_POST['column_to_print']))
        : array();
    logMessage("Columns to Print: " . implode(", ", $column_to_print));

    $monthly_price = isset($_POST['monthly_price_input'])
        ? sanitize_text_field(wp_unslash($_POST['monthly_price_input']))
        : '';
    logMessage("Monthly Price: " . $monthly_price);


    if ($revised_quotation === 'false' || $running_number === '') {
        $running_number = 'Q' . date('Y') . '/' . str_pad(get_number_of_quotes() + 1, 4, '0', STR_PAD_LEFT);
        $revision_number = 0;
        logMessage("Running Number: " . $running_number);
    } else {
        $revision_number = get_number_of_revision($running_number) + 1;
        logMessage("Revision Number: Q" . $running_number . '_R' . $revision_number);
    }

    // Retrieve items data - services
    $items = array();
    if (isset($_POST['item']) && isset($_POST['quantity']) && isset($_POST['price'])) {
        $row_ids = $_POST['row_id'];
        $item_descriptions = $_POST['item'];
        $quantities = $_POST['quantity'];
        $prices = $_POST['price'];
        $service_names = isset($_POST['service_name']) ? $_POST['service_name'] : array(); // เพิ่มบรรทัดนี้
        $group_ids = isset($_POST['group_id']) ? $_POST['group_id'] : array(); // เพิ่มบรรทัดนี้

        $total_amount = $_POST['total_amount_without_vat_and_discount']; // Initialize total amount
        $total_amount = floatval($total_amount);
        $included_prices = [];
        $include_all = isset($_POST['include_all']) ? $_POST['include_all'] : '';

        // สร้าง map สำหรับ include_all ของแต่ละ group
        $include_all_map = [];
        foreach (array_keys($_POST) as $key) {
            if (preg_match('/^include_all_(.+)$/', $key, $matches)) {
                $include_all_map[$matches[1]] = $_POST[$key];
            }
        }

        foreach ($item_descriptions as $index => $item_description) {

            $quantity = (isset($quantities[$index]) && $quantities[$index] !== '')
                ? (float) $quantities[$index]
                : 0;

            $price = (isset($prices[$index]) && $prices[$index] !== '')
                ? (float) $prices[$index]
                : 0;

            $service_name = $service_names[$index] ?? '';
            $group_id     = $group_ids[$index] ?? '';
            $row_id       = $row_ids[$index] ?? '';

            $total_price = $quantity * $price;

            $items[] = array(
                'description' => $item_description, // sanitized แล้ว
                'quantity' => $quantity,
                'price' => $price,
                'total_price' => $total_price,
                'service_name' => $service_name,
                'group_id' => $group_id,
                'row_id' => $row_id,
            );
        }


        // Initialize discount subtotal
        $discount_sub_total = 0;

        // Calculate discount subtotal based on discount type
        if ($discount_type === 'percentage') {
            $discount_sub_total = $total_amount * ($discount / 100);
        } else if ($discount_type === 'fixed') {
            $discount_sub_total = $discount;
        }

        // Ensure the discount subtotal does not exceed the total amount
        $discount_sub_total = min($discount_sub_total, $total_amount);

        // Calculate VAT amount based on total amount with discount
        $vat_amount = $_POST['total_vat_amount'];
        $vat_amount = floatval($vat_amount);

        $total_amount_with_vat = $_POST['total_amount_with_vat'];
        $total_amount_with_vat = floatval($total_amount_with_vat);
    }

    // รับ service_group_name จาก POST
    $service_group_names = isset($_POST['service_group_name']) ? $_POST['service_group_name'] : array();

    // ในส่วน $history array ให้เพิ่ม include_all_map และ service_group_name
    $history = array(
        'quotation_valid_date' => $quotation_valid_date,
        'project_desc' => $project_desc,
        'company_name' => $company_name,
        'full_name' => $full_name,
        'company_address' => $company_address,
        'company_email' => $company_email,
        'company_phone' => $company_phone,
        'client_name' => $client_name,
        'client_address' => $client_address,
        'client_email' => $client_email,
        'client_phone' => $client_phone,
        'customer_tax_id' => $customer_tax_id,
        'remark' => $remark,
        'discount_type' => $discount_type,
        'discount' => $discount,
        'vat_percentage' => $vat_percentage,
        'currency' => $selected_currency,
        'items' => $items,
        'total_amount' => $total_amount,
        'discount_sub_total' => $discount_sub_total,
        'vat_amount' => $vat_amount,
        'total_amount_with_vat' => $total_amount_with_vat,
        'quotation_date' => $quotation_date,
        'include_all' => $include_all,
        'include_all_map' => $include_all_map,
        'service_group_name' => $service_group_names, 
        'revised_quotation' => $revised_quotation,
        'running_number' => $running_number,
        'revision_number' => $revision_number,
        'monthly_price' => $monthly_price,
        'service_group_id'      => $service_group_id,       
        'service_display_name'  => $service_display_name,   
    );

    add_quote_history(
        wp_json_encode($history, JSON_UNESCAPED_UNICODE),
        $running_number,
        $revision_number
    );

    // Include the header template (HTML)
    ob_start();
    include 'templates/quote-header-template.php'; // This contains your header HTML
    $header = ob_get_clean(); // Capture the header content

    // Include the main content template (HTML)
    ob_start();
    include 'templates/quote-content-template.php';
    $content = ob_get_clean(); // Capture the main content

    logMessage("HTML content loaded into DOMPDF");

    // Combine header and content for the full HTML
    $fullHtml = $header . $content; // You can add any separator like <hr> if needed

    // Configure Dompdf options
    $options = new Options();
    $options->set('isHtml5ParserEnabled', true);
    $options->set('isPhpEnabled', true);
    $options->set('isRemoteEnabled', true);
    $options->set('defaultFont', 'Sarabun');

    // Instantiate Dompdf
    $dompdf = new Dompdf($options);

    // Load HTML content
    $dompdf->loadHtml($fullHtml);

    // Set paper size and orientation
    $dompdf->setPaper('a3', 'portrait');

    // Render the HTML as PDF
    $dompdf->render();

    // Add page numbers
    $canvas = $dompdf->getCanvas();
    $canvas->page_script(function ($pageNumber, $pageCount, $canvas, $fontMetrics) {
        $text = "Page $pageNumber of $pageCount";
        $font = $fontMetrics->get_font("Arial", "normal");
        $size = 12;
        $width = $fontMetrics->getTextWidth($text, $font, $size);
        $canvas->text(($canvas->get_width() - $width) / 2, $canvas->get_height() - 30, $text, $font, $size);
    });

    // Get the height of the rendered PDF
    $pdf_height = $dompdf->getCanvas()->get_height();

    // Get the maximum height allowed for the page
    $max_page_height = $dompdf->getOptions()->get('page_height');

    // Keep current options for long content to prevent Thai font fallback that breaks Unicode rendering.
    if ($pdf_height > $max_page_height) {
        logMessage("PDF content exceeds one page height; keep original render options.");
    }

    // Output the PDF
    $dompdf->stream('quote.pdf', array('Attachment' => 0));
    logMessage("PDF streaming completed");
}

add_action('admin_post_process_quote_form', 'process_quote_form');
