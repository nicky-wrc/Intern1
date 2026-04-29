<?php
$_POST = wp_unslash($_POST);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected_package = isset($_POST['package_name']) ? $_POST['package_name'] : 'No package selected';
}
// --- Added: minimal safe fallbacks to avoid undefined-variable warnings that break PDF rendering ---
$column_to_print = $column_to_print ?? (isset($_POST['column_to_print']) ? (array) $_POST['column_to_print'] : null);
$currency_symbol = $currency_symbol ?? (
    isset($_POST['currency'])
    ? (($_POST['currency'] === 'USD') ? '$' : (($_POST['currency'] === 'GBP') ? '£' : (($_POST['currency'] === 'EUR') ? '€' : (($_POST['currency'] === 'SGD') ? 'S$' : '฿'))))
    : '฿'
);
$included_prices = $included_prices ?? [];
$discount = isset($discount) ? $discount : (isset($_POST['discount']) ? floatval($_POST['discount']) : 0);
$discount_type = $discount_type ?? (isset($_POST['discount_type']) ? $_POST['discount_type'] : 'fixed');
$vat_percentage = isset($vat_percentage) ? $vat_percentage : (isset($_POST['vat_percentage']) ? floatval($_POST['vat_percentage']) : 0);
$total_amount = isset($total_amount) ? floatval($total_amount) : (isset($_POST['total_amount_without_vat_and_discount']) ? floatval($_POST['total_amount_without_vat_and_discount']) : 0);
$discount_sub_total = $discount_sub_total ?? 0;
$vat_amount = isset($vat_amount) ? floatval($vat_amount) : (isset($_POST['total_vat_amount']) ? floatval($_POST['total_vat_amount']) : 0);
$total_amount_with_vat = isset($total_amount_with_vat) ? floatval($total_amount_with_vat) : (isset($_POST['total_amount_with_vat']) ? floatval($_POST['total_amount_with_vat']) : ($total_amount - $discount_sub_total + $vat_amount));
$monthly_price = $monthly_price ?? (isset($_POST['monthly_price_input']) ? $_POST['monthly_price_input'] : '');
$full_name = $full_name ?? (isset($_POST['full_name']) ? $_POST['full_name'] : '');
$company_phone = $company_phone ?? (isset($_POST['company_phone']) ? $_POST['company_phone'] : '');
$company_email = $company_email ?? (isset($_POST['company_email']) ? $_POST['company_email'] : '');
// --- end added fallbacks ---

/* Prevent browser from repeating the table header on every printed page
                             (display: table-header-group causes repetition). Use table-row-group
                             so header is only part of the normal flow and prints only once.) */
?>
<style>
    @font-face {
        font-family: 'Sarabun';
        font-style: normal;
        font-weight: normal;
        src: url('<?php echo plugins_url("TBS-Quote-Generator-v3/assets/fonts/Sarabun-Regular.ttf"); ?>') format('truetype');
    }

    @font-face {
        font-family: 'Sarabun';
        font-style: normal;
        font-weight: bold;
        src: url('<?php echo plugins_url("TBS-Quote-Generator-v3/assets/fonts/Sarabun-Bold.ttf"); ?>') format('truetype');
    }

    @font-face {
        font-family: 'Sarabun';
        font-style: italic;
        font-weight: normal;
        src: url('<?php echo plugins_url("TBS-Quote-Generator-v3/assets/fonts/Sarabun-Italic.ttf"); ?>') format('truetype');
    }

    @font-face {
        font-family: 'Sarabun';
        font-style: italic;
        font-weight: bold;
        src: url('<?php echo plugins_url("TBS-Quote-Generator-v3/assets/fonts/Sarabun-BoldItalic.ttf"); ?>') format('truetype');
    }

    /* ===== Global ===== */
    * {
        font-family: 'Sarabun', sans-serif;
        line-height: 1.2;
        box-sizing: border-box;
    }

    body {
        margin-top: 180px;
    }

    /* ===== Layout ===== */
    .row {
        padding-top: 5px;
        display: table;
        width: 100%;
    }

    .cell {
        display: table-cell;
        vertical-align: top;
    }

    .logo {
        text-align: left;
    }

    .quotation {
        text-align: right;
    }

    .customer,
    .date {
        width: 50%;
    }

    .footer,
    .footer .content-above,
    .footer .content-middle,
    .footer .content-below {
        width: 100%;
        text-align: center;
    }

    .footer .content-below h3,
    .footer .content-below p {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }

    /* ===== Page / Print ===== */
    .page-break {
        page-break-inside: avoid;
    }

    .content-middle {
        margin-bottom: 40px;
        text-align: center;
    }

    /* ===== Signature (3 columns) ===== */
    .signature-fields{
        display: table;
        width: 100%;
        table-layout: fixed;
        margin: 10px 0 0 0;
        text-align: left; /* ให้ label ชิดซ้ายในแต่ละช่อง */
    }

    .signature-field{
        display: table-cell;
        width: 33.3333%;
        vertical-align: top;
        padding-right: 20px;
    }

    .signature-field:last-child{
        padding-right: 0;
    }

    .signature-field p{
        margin: 0 0 6px 0;
    }

    .signature-field div{
        border: 1px solid #000;
        width: 100%;
        height: 40px;
        margin-top: 0;
    }

    /* keep the acceptance sentence centered */
    .content-middle > p{
        text-align: center;
        margin: 14px 0;
    }

    /* ===== Service Table ===== */
    .service-table-container {
        margin: 20px 0 30px 0;
    }

    .service-table-container table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .service-table-container thead th {
        background-color: #3C3D3A;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
    }

    .service-table-container .service-group-header td {
        background: #E5E5E5;
        font-size: 16px;
        font-weight: bold;
        padding: 10px;
    }

    .service-table-container td.description {
        white-space: normal;
        word-break: break-word;
    }

    .service-table-container .parent-row td.description {
        font-weight: bold;
    }

    /* ===== Summary Table ===== */
    .inner-table {
        border-collapse: collapse;
    }

    .inner-table td {
        border: 1px solid #000;
    }

    .inner-table tr:last-child td {
        font-weight: bold;
    }
</style>

<div id="quotation">
    <div class="row" style="margin-top:-10px;">
        <div class="cell customer">
            <h4><u>Customer</u></h4>
            <table style="margin-top:-20px;">
                <tr>
                    <td><?php echo esc_html( wp_unslash($client_name) ); ?></td>
                </tr>
                <tr>
                    <td><?php echo htmlspecialchars($customer_tax_id); ?></td>
                </tr>
                <tr>
                    <td><?php echo esc_html( function_exists('wp_unslash') ? wp_unslash($client_address) : stripslashes((string)$client_address) ); ?></td>
                </tr>
                <tr>
                    <td><?php echo htmlspecialchars($client_email); ?></td>
                </tr>
                <tr>
                    <td><?php echo esc_html( function_exists('wp_unslash') ? wp_unslash($client_phone)   : stripslashes((string)$client_phone) ); ?></td>
                </tr>
            </table>
        </div>
        <div class="cell date">
            <h4><u>Quote/Project Description</u></h4>
            <table style="margin-top:-20px;">
                <tr>
                    <td><?php echo nl2br( esc_html( wp_unslash($project_desc) ) ); ?></td>
                </tr>
            </table>
        </div>
    </div>

    <?php
    // Build items array from POST
    $items = [];
    if (!empty($_POST['item']) && is_array($_POST['item'])) {
        $count = count($_POST['item']);
        for ($i = 0; $i < $count; $i++) {
            $qty = (int)($_POST['quantity'][$i] ?? 1);
            $price = (float)($_POST['price'][$i] ?? 0);
            $items[] = [
                'row_id'      => $_POST['row_id'][$i] ?? ($i + 1),
                'parent_id'   => $_POST['parent_id'][$i] ?? null,
                'group_id'    => $_POST['group_id'][$i] ?? 'ungrouped',
                'description' => wp_unslash($_POST['item'][$i] ?? ''),
                'quantity'    => $qty,
                'price'       => $price,
                'total_price' => $qty * $price,
            ];
        }
    }

    // Group items by group_id
    $groups = [];
    foreach ($items as $item) {
        $gid = $item['group_id'] ?: 'ungrouped';
        $groups[$gid][] = $item;
    }

    // Service group names and per-group include_all flags
    $service_group_names = $_POST['service_group_name'] ?? [];
    $include_all_map = [];
    foreach (array_keys($groups) as $gid) {
        $include_all_map[$gid] = isset($_POST["include_all_{$gid}"]) && $_POST["include_all_{$gid}"] == '1';
    }

    // Calculate colspan based on which columns to print
    $colspan = 3; // #, Description, Amount
    if (!is_null($column_to_print) && in_array('Qty', $column_to_print)) $colspan++;
    if (!is_null($column_to_print) && in_array('Rate', $column_to_print)) $colspan++;

    // Render all groups inside a single table so the header repeats on printed pages
    if (!empty($groups)): ?>

        <div class="service-table-container" style="margin: 10px 0 0 0;">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                <thead style="background-color: #3C3D3A; display: table-header-group;border: 1px solid black;">
                    <tr>
                        <th style="border-bottom: 1px solid black; text-align: center; color:#fff;">#</th>
                        <th style="border-bottom: 1px solid black; padding: 10px 10px 10px 0px; text-align: left; color:#fff;">Description</th>

                        <?php if (!is_null($column_to_print) && in_array('Qty', $column_to_print)) : ?>
                            <th style="border-bottom: 1px solid black; padding: 10px; text-align: left; color:#fff;">Qty.</th>
                        <?php endif; ?>
                        <?php if (!is_null($column_to_print) && in_array('Rate', $column_to_print)) : ?>
                            <th style="border-bottom: 1px solid black; padding: 10px; text-align: left; color:#fff;">Rate</th>
                        <?php endif; ?>

                        <th style="border-bottom: 1px solid black; padding: 10px; text-align: center; color:#fff;">Amount</th>
                    </tr>
                </thead>

                <tbody style="border:1px solid #000;">
                    <?php
                    $service_display_names = $_POST['service_display_name'] ?? [];
                    ?>

                    <?php foreach ($groups as $gid => $group_items): ?>
                        <?php
                        $group_include_all = $include_all_map[$gid] ?? false;
                        ?>
                        <?php
                        // ===== 1️⃣ คำนวณชื่อ service =====
                        $group_name = trim($service_group_names[$gid] ?? '') ?: 'General Services';

                        if (!empty($service_display_names[$gid])) {
                            $display_name = trim($service_display_names[$gid]);
                        } else {
                            $display_name = $group_name;
                        }

                        if ($display_name === '') {
                            $display_name = '-';
                        }
                        $group_total = 0;
                        foreach ($group_items as $it) {
                            $group_total += $it['total_price'];
                        }
                        ?>

                        <!-- ===== 2️⃣ Service header ===== -->
                        <tr style="border:1px solid #000;">
                            <td colspan="<?php echo $colspan; ?>"
                                style="background:#eee; font-weight:bold; padding: 10px;">
                                Service: <?php echo htmlspecialchars($display_name); ?>
                            </td>
                        </tr>

                        <?php
                        // ===== 3️⃣ LOOP รายการภายใน service (สำคัญมาก) =====
                        $parent_counter = 1;
                        $total_rows = count($group_items);

                        foreach ($group_items as $index => $item):
                            $is_parent_row = strpos($item['row_id'], '.') === false;
                            $display_row_id = $is_parent_row ? $parent_counter++ : $item['row_id'];
                        ?>

                            <tr style="border:1px solid #000;">
                                <td style="width: 10%; text-align:center; border-right:1px solid #000;">
                                    <?php echo htmlspecialchars($display_row_id); ?>
                                </td>

                                <td style="padding-left:10px; width: 50%; <?php echo $is_parent_row ? 'font-weight: bold;' : 'font-weight: normal;'; ?>">
                                    <?php echo esc_html( wp_unslash($item['description']) ); ?>
                                </td>

                                <?php if (!is_null($column_to_print) && in_array('Qty', $column_to_print)) : ?>
                                    <td style="padding-left:10px; border-right:1px solid #000;">
                                        <?php echo $item['quantity']; ?>
                                    </td>
                                <?php endif; ?>

                                <?php if (!is_null($column_to_print) && in_array('Rate', $column_to_print)) : ?>
                                    <td style="padding-left:10px; border-right:1px solid #000;">
                                        <?php echo $item['price'] == 0 ? 'Included' : $currency_symbol . number_format($item['price'], 0); ?>
                                    </td>
                                <?php endif; ?>

                                <?php if ($group_include_all): ?>
                                    <?php if ($index === 0): ?>
                                        <td rowspan="<?php echo $total_rows; ?>"
                                            style="border: 1px solid #000; text-align: center; padding: 10px; vertical-align: middle;">
                                            <?php echo $currency_symbol . " " . number_format($group_total, 0); ?>
                                        </td>
                                    <?php endif; ?>
                                <?php else: ?>
                                    <td style="border: 1px solid #000; text-align: center; padding: 5px;">
                                        <?php echo $item['price'] == 0 ? '-' : $currency_symbol . number_format($item['total_price'], 0); ?>
                                    </td>
                                <?php endif; ?>
                            </tr>

                        <?php endforeach; ?>

                    <?php endforeach; ?>

                </tbody>
            </table>
        </div>
    <?php endif; ?>

    <!-- Summary Table -->
    <div class="row" style="position: relative; min-height: 180px; margin-bottom: 50px;">
        <table style="width: 40%; position: absolute; right: 0;">
            <tr>
                <td style="text-align: left;padding: 10px; font-size: 14px;"><strong>Sub Total </strong></td>
                <td style="text-align: right; padding: 10px; font-size: 14px;"><?php echo $currency_symbol; ?> <?php echo number_format($total_amount, 2); ?></td>
            </tr>
            <?php if ($discount != 0) : ?>
                <tr>
                    <?php if ($discount_type === 'percentage') : ?>
                        <td style="text-align: left;padding: 10px; font-size: 14px;"><strong>Discount</strong> (<?php echo number_format($discount, 0) . '%'; ?>)</td>
                    <?php else : ?>
                        <td style="text-align: left;padding: 10px; font-size: 14px;"><strong>Discount</strong> (<?php echo $currency_symbol; ?> <?php echo number_format($discount, 0); ?>)</td>
                    <?php endif; ?>
                    <td style="text-align: right; padding: 10px; font-size: 14px;">- <?php echo $currency_symbol; ?> <?php echo number_format($discount_sub_total); ?></td>
                </tr>
            <?php endif; ?>
            <?php if ($vat_percentage != 0) : ?>
                <tr>
                    <td style="text-align: left;padding: 10px; font-size: 14px;"><strong>VAT </strong>(<?php echo number_format($vat_percentage, 0); ?>%)</td>
                    <td style="text-align: right; padding: 10px; font-size: 14px;"><?php echo $currency_symbol; ?> <?php echo number_format($vat_amount, 2); ?></td>
                </tr>
            <?php endif; ?>
            <tr>
                <td style="text-align: left;background: #D3D3D3;padding: 10px; font-size: 14px;"><strong>Total Amount</strong></td>
                <td style="text-align: right;background: #D3D3D3;padding: 10px; font-size: 14px; "><?php echo $currency_symbol; ?>
                    <?php
                    echo number_format($total_amount_with_vat, 2);

                    if (!empty($monthly_price) && preg_match('/^(\d{1,2}) Month$/', $monthly_price)) {
                        echo ' / ' . $monthly_price;
                    } elseif ($monthly_price === 'Year') {
                        echo ' / Year';
                    }
                    ?>
                </td>
            </tr>
        </table>
    </div>

    <!-- Remarks -->
    <?php
    // Estimate service table rows to decide whether Remarks should start on a new page.
    $service_row_count = 0;
    foreach ($groups as $gid => $gitems) {
        $service_row_count += 1; // group header
        $service_row_count += count($gitems); // items
    }
    // Tweak this to match your page layout (font-size, margins).
    $rows_per_page = 22;
    $mod = $service_row_count % $rows_per_page;
    $leftover = ($mod === 0) ? $rows_per_page : ($rows_per_page - $mod);
    // If remaining lines on the current page are <= 10, force remarks to next page
    $need_page_break = ($leftover <= 10);

    // Set style based on page break condition
    if ($need_page_break) {
        $remarks_style = 'page-break-before: always; width:96%; margin-top: 0px; background: lightgrey; padding: 15px 20px; word-break: break-word; clear: both;';
    } else {
        $remarks_style = 'width:96%; margin-top: 0px; background: lightgrey; padding: 15px 20px; word-break: break-word; clear: both;';
    }
    ?>
    <div class="remarks-box" style="<?php echo $remarks_style; ?>">
        <h4><u>Remarks</u></h4>
        <div class="remarks" style="margin-top: 0px;">
            <?php
            // Process remark lines: make lines that start with "Service:" bold
            $processed_remark = '';
            if (!empty($remark)) {
                $lines = preg_split("/\r\n|\n|\r/", $remark);
                foreach ($lines as $line) {
                    $trim = trim($line);
                    if ($trim === '') {
                        $processed_remark .= '<br>';
                        continue;
                    }
                    if (strpos($trim, 'Service:') === 0) {
                        $processed_remark .= '<p><strong>' . esc_html( wp_unslash($trim) ) . '</strong></p>';
                    } else {
                        $processed_remark .= '<p>' . nl2br( esc_html( wp_unslash($trim) ) ) . '</p>';
                    }
                }
            } else {
                $processed_remark = '<p>-</p>';
            }
            ?>
            <div style="margin-top: -10px;"><?php echo $processed_remark; ?></div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="content-above">
            <p>Above information is not an invoice and only an estimate of services/goods described above.
                <br>Payment will be collected in prior to provision of services/goods described in this quote.
            </p>
        </div>

        <div class="content-middle page-break">
            <hr>
            <div class="signature-fields">
                <div class="signature-field">
                    <p>Client's Signature:</p>
                    <div></div>
                </div>
                <div class="signature-field">
                    <p>Client’s Printed Name:</p>
                    <div></div>
                </div>
                <div class="signature-field">
                    <p>Date:</p>
                    <div></div>
                </div>
            </div>

            <div class="signature-fields">
                <div class="signature-field">
                    <p>Authorized Signature:</p>
                    <div></div>
                </div>
                <div class="signature-field">
                    <p>Printed Name:</p>
                    <div></div>
                </div>
                <div class="signature-field">
                    <p>Date:</p>
                    <div></div>
                </div>
            </div>
            <p>Please confirm your acceptance of this quote by signing this document</p>
            <hr>
        </div>

        <div class="content-below page-break" style="text-align: center;">
            <h3 style="text-align: center;">Thank you for your business!</h3>
            <p style="text-align: center;">Should you have any enquiries concerning this quote, please contact <?php echo htmlspecialchars($full_name); ?> at <?php echo !empty($company_phone) ? htmlspecialchars($company_phone) : htmlspecialchars($company_email); ?></p>
            <p style="text-align: center;">1023, 4th Floor TPS Building Pattanakarn Road, Suanluang, Bangkok, Thailand, 10250</p>
            <p style="text-align: center;">Tel: 02-007-5800 | Email: <?php echo htmlspecialchars($company_email); ?> | Website: www.tbs-marketing.com</p>
        </div>
    </div>

</div>