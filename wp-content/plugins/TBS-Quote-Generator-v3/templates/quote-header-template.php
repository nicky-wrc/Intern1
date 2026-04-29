<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isChecked = isset($_POST['column_to_print']) && in_array('Quotation-number', $_POST['column_to_print']);
}
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

    * {
        font-family: 'Sarabun', sans-serif;
        line-height: 1;
    }

    .header {
        position: fixed;
        top: 0;
        width: 100%;
        text-align: right;
        background-color: #fff;
        padding-bottom: 185px;
        border-bottom: 2px solid #808080;
    }

    .header .logo {
        text-align: left;
        float: left;
    }

    .header .quotation {
        float: right;
        text-align: right;
    }

    .header img {
        width: 150px;
    }

    body {
        margin-top: 150px;
        /* Adjust according to the height of the header */
    }

    /* Other content styles */
    .row {
        display: table;
        width: 100%;
    }

    .cell {
        display: table-cell;
    }

    .footer {
        width: 100%;
        text-align: center;
    }
</style>

<div class="header">
    <div class="logo">
        <img src="https://quotation.tbs-marketing.com/wp-content/uploads/2024/03/TBS-Logo.png" alt="TBS Logo">
        <p><?php echo $company_name; ?></p>
    </div>
    <div class="quotation">
        <h1>Quotation</h1>
        <p><strong>Quote Date : </strong> <?php echo date('d/m/Y', strtotime($quotation_date)); ?><br>

            <strong>Valid Until : </strong> <?php echo date('d/m/Y', strtotime($quotation_valid_date)); ?>
        </p>

        <?php if (!empty($isChecked)): ?>
            <div id="QuotationText" style="margin-top: -30px;">
                <p>
                    <strong>Quotation number : </strong>
                    <?php
                    // แสดงผลข้อมูล quotation number และ revision number
                    echo $revision_number ? $running_number . '_R' . $revision_number : $running_number;
                    ?>
                </p>
            </div>
        <?php endif; ?>
    </div>
</div>
